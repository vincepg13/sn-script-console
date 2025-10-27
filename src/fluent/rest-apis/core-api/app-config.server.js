(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const gUser = gs.getUser();

  const util = (() => {
    try {
      return new ScriptConsoleUtils();
    } catch (e) {
      gs.info('Script Console Error - Global dependency missing');
      return false;
    }
  })();

  if (!util) {
    throw new Error('Global Dependency Missing');
  }

  const scope = util.sgu.getCurrentScope();
  const updateSet = util.sgu.getCurrentUpdateSet();

  const user = {
    username: gs.getUserName(),
    guid: gs.getUserID()
  };

  const appDataConfig = { scope, updateSet, user };
  appDataConfig.preferences = {
    lastWidget: gUser.getPreference('script_console.widget'),
    theme: gUser.getPreference('script_console.codemirror_theme') || 'atom',
    sidebarOpen: gUser.getPreference('script_console.sidebar_open') || 'true',
    autoScopeSwitch: gUser.getPreference('script_console.scope_switch') || 'false',
    autoPackageAdd: gUser.getPreference('script_console.package_add') || 'false',
    directToWidget: gUser.getPreference('script_console.direct_widget') || 'false'
  };

  //Set prettier config to default and override if custom options available
  appDataConfig.prettierConfig = util.getPrettierConfig();

  //Set linting config to default and override if custom options available
  appDataConfig.esLintConfig = util.getLintingConfig();

  //Set current and available user packages
  const currentPackage = gUser.getPreference('script_console.current_package') || '';
  appDataConfig.packageData = {
    currentPackage,
    packages: util.getMyPackages()
  };

  appDataConfig.packageData.packageItems = currentPackage ? util.getPackageItems(currentPackage) : {};

  try {
    appDataConfig.menu = JSON.parse(gs.getProperty('x_659318_script.app_menu'));
  } catch (e) {
    gs.info('Unparseable JSON - menu');
  }

  try {
    appDataConfig.scriptTables = JSON.parse(gs.getProperty('x_659318_script.script_tables'));
  } catch (e) {
    gs.info('Unparseable JSON - script tables');
  }

  return response.setBody(appDataConfig);
})(request, response);
