(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const { name, description } = request.body.data;

  if (!name || !description) {
    return response.setError(
      new sn_ws_err.BadRequestError('A name and description must be provided to create a package.')
    );
  }

  const util = new ScriptConsoleUtils();
  const sgu = util.sgu;
  const user = gs.getUserID();

  const grPref = sgu.getGlobalGr('sys_user_preference');
  grPref.addQuery('name', name);
  grPref.addQuery('user', user);
  grPref.query();

  if (grPref.next()) {
    return response.setError(new sn_ws_err.BadRequestError('Package name already taken'));
  }

  grPref.initialize();
  sgu.grMethod(grPref, 'setValue', ['user', user]);
  sgu.grMethod(grPref, 'setValue', ['name', name]);
  sgu.grMethod(grPref, 'setValue', ['value', '{}']);
  sgu.grMethod(grPref, 'setValue', ['description', description]);
  const preferenceId = grPref.insert();

  gs.getUser().savePreference('script_console.current_package', name);
  const packages = util.getMyPackages();

  return response.setBody({ preferenceId, packages });
})(request, response);
