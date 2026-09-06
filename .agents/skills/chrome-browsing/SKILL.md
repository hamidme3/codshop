---
name: chrome-browsing
description: Automated Chrome live browsing, responsive auditing, visual screenshot verification, and interactive E2E testing for CODShop.
---

# Chrome Live Browsing & E2E Testing Skill

This skill allows agents to interactively live-browse CODShop, verify React hydration, inspect CSS variables across 25 themes, submit Moroccan COD checkout forms, and test authenticated backoffice dashboards.

## Scripts
- `node scripts/live-chrome-tester.js --suite=<all|themes|checkout|admin|sso>`
- `node scripts/chrome-mcp-server.js` (MCP stdio server)
