(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const { packageId } = request.body.data;

  if (!packageId) {
    return response.setError(new sn_ws_err.BadRequestError('A packageId must be provided to change a package.'));
  }

  const gUser = gs.getUser();
  gUser.savePreference('script_console.current_package', packageId);

  const util = new ScriptConsoleUtils();
  const packageValue = util.getPackageItems(packageId);
  return response.setBody(packageValue);
})(request, response);
