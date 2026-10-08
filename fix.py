with open("src/lib/puck-config.tsx", "r") as f:
    content = f.read()

# First replace the defaultThemeConfig to add normalizeThemeConfig
old_default = """export const defaultThemeConfig = {
  primaryColor: '#09090b',
  accentColor: '#c59b27',
  bgPage: '#ffffff',
  buttonRadius: 'rounded',
  fontFamily: 'sans'
};"""

new_default = """export const defaultThemeConfig = {
  primaryColor: '#09090b',
  accentColor: '#c59b27',
  bgPage: '#ffffff',
  buttonRadius: 'rounded',
  fontFamily: 'sans'
};

export const normalizeThemeConfig = (config: any) => {
  if (!config) return defaultThemeConfig;
  if (config.colors) {
    return {
      ...defaultThemeConfig,
      primaryColor: config.colors.primary || defaultThemeConfig.primaryColor,
      accentColor: config.colors.accent || defaultThemeConfig.accentColor,
      bgPage: config.colors.bgPage || defaultThemeConfig.bgPage,
    };
  }
  return {
    ...defaultThemeConfig,
    ...config
  };
};"""

content = content.replace(old_default, new_default)

# Now fix the getPuckConfig signature and add the missing closing braces
content = content.replace("export const getPuckConfig = (themeConfig: any = defaultThemeConfig): Config<Props> => ({", 
"export const getPuckConfig = (rawConfig: any = defaultThemeConfig): Config<Props> => {\n  const themeConfig = normalizeThemeConfig(rawConfig);\n  return {")

content = content.replace("    WhatsAppBar: {\n      fields: {\n        phone: { type: \"text\" },\n        message: { type: \"textarea\" },\n        buttonText: { type: \"text\" }\n      },\n      defaultProps: {\n        phone: \"+212661000000\",\n        message: \"Salam, I want to ask about this item and order\",\n        buttonText: \"Order via WhatsApp\"\n      },\n      render: (props) => (\n        <WhatsAppBarSection settings={props} themeConfig={themeConfig} />\n      )\n    }\n  }\n});",
"    WhatsAppBar: {\n      fields: {\n        phone: { type: \"text\" },\n        message: { type: \"textarea\" },\n        buttonText: { type: \"text\" }\n      },\n      defaultProps: {\n        phone: \"+212661000000\",\n        message: \"Salam, I want to ask about this item and order\",\n        buttonText: \"Order via WhatsApp\"\n      },\n      render: (props) => (\n        <WhatsAppBarSection settings={props} themeConfig={themeConfig} />\n      )\n    }\n  }\n  };\n};")

with open("src/lib/puck-config.tsx", "w") as f:
    f.write(content)
