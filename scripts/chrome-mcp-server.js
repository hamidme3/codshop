#!/usr/bin/env node

/**
 * CODShop Chrome Live Browsing MCP Server
 * Powered by puppeteer-core & Model Context Protocol SDK
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';

let browser = null;
let page = null;
let consoleErrors = [];

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      defaultViewport: { width: 1280, height: 800 },
    });
  }
  return browser;
}

async function getPage() {
  const b = await getBrowser();
  if (!page || page.isClosed()) {
    page = await b.newPage();
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.toString());
    });
  }
  return page;
}

const server = new Server(
  {
    name: 'codshop-chrome-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'chrome_navigate',
        description: 'Navigate to any URL in headless Chromium, optional cookie injection.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL to navigate to' },
            cookie: { type: 'string', description: 'Optional Cookie string name=value' },
            waitForSelector: { type: 'string', description: 'Optional CSS selector to wait for' },
          },
          required: ['url'],
        },
      },
      {
        name: 'chrome_audit_page',
        description: 'Perform a live audit on a page: checks title, HTTP status, console errors, and captures rendered text.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL to audit' },
            cookie: { type: 'string', description: 'Optional cookie to attach' },
            screenshotPath: { type: 'string', description: 'Optional path to save PNG screenshot' },
          },
          required: ['url'],
        },
      },
      {
        name: 'chrome_evaluate',
        description: 'Execute JavaScript expression in the live Chromium page context.',
        inputSchema: {
          type: 'object',
          properties: {
            expression: { type: 'string', description: 'JavaScript code or expression to run' },
          },
          required: ['expression'],
        },
      },
      {
        name: 'chrome_click',
        description: 'Click a DOM element matching a CSS selector.',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector to click' },
          },
          required: ['selector'],
        },
      },
      {
        name: 'chrome_fill',
        description: 'Type text into an input field matching a CSS selector.',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector of the input field' },
            value: { type: 'string', description: 'Text value to fill' },
          },
          required: ['selector', 'value'],
        },
      },
      {
        name: 'chrome_screenshot',
        description: 'Capture screenshot of current page or element to a file.',
        inputSchema: {
          type: 'object',
          properties: {
            outputPath: { type: 'string', description: 'File path to save the screenshot' },
            fullPage: { type: 'boolean', description: 'Whether to capture full page' },
          },
          required: ['outputPath'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const p = await getPage();

  try {
    if (name === 'chrome_navigate') {
      if (args.cookie) {
        const [cName, cVal] = args.cookie.split('=');
        await p.setCookie({
          name: cName.trim(),
          value: cVal.trim(),
          url: args.url,
        });
      }
      const response = await p.goto(args.url, { waitUntil: 'networkidle2', timeout: 30000 });
      if (args.waitForSelector) {
        await p.waitForSelector(args.waitForSelector, { timeout: 10000 });
      }

      const title = await p.title();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: response ? response.status() : 200,
                title,
                url: p.url(),
                consoleErrorsCount: consoleErrors.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'chrome_audit_page') {
      consoleErrors = [];
      if (args.cookie) {
        const [cName, cVal] = args.cookie.split('=');
        await p.setCookie({
          name: cName.trim(),
          value: cVal.trim(),
          url: args.url,
        });
      }
      const response = await p.goto(args.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const title = await p.title();
      const bodyText = await p.evaluate(() => document.body.innerText.slice(0, 500));

      let screenshotSaved = null;
      if (args.screenshotPath) {
        const dir = path.dirname(args.screenshotPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await p.screenshot({ path: args.screenshotPath, fullPage: false });
        screenshotSaved = args.screenshotPath;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                url: args.url,
                httpStatus: response ? response.status() : 200,
                title,
                consoleErrors,
                textSnippet: bodyText.replace(/\n+/g, ' ').slice(0, 200),
                screenshot: screenshotSaved,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'chrome_evaluate') {
      const result = await p.evaluate((expr) => {
        try {
          return eval(expr);
        } catch (e) {
          return { error: e.toString() };
        }
      }, args.expression);

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'chrome_click') {
      await p.waitForSelector(args.selector, { timeout: 5000 });
      await p.click(args.selector);
      return {
        content: [{ type: 'text', text: `Clicked ${args.selector}` }],
      };
    }

    if (name === 'chrome_fill') {
      await p.waitForSelector(args.selector, { timeout: 5000 });
      await p.type(args.selector, args.value);
      return {
        content: [{ type: 'text', text: `Filled ${args.selector} with ${args.value}` }],
      };
    }

    if (name === 'chrome_screenshot') {
      const dir = path.dirname(args.outputPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await p.screenshot({ path: args.outputPath, fullPage: !!args.fullPage });
      return {
        content: [{ type: 'text', text: `Screenshot saved to ${args.outputPath}` }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Chrome Error: ${error.message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CODShop Chrome MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});
