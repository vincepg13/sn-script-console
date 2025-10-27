(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const { packageId, table, path, label, guid, tableLabel } = request.body.data;

  if (!packageId || !table || !path) {
    return response.setError(
      new sn_ws_err.BadRequestError('A packageId, table, and path must be provided to add an item to a package.')
    );
  }

  const util = new ScriptConsoleUtils();
  const result = util.addToPackage(packageId, table, path, label || '', guid || '', tableLabel || '');

  if (result.success) {
    return response.setBody(result.package);
  } else {
    return response.setError(new sn_ws_err.BadRequestError(result.error));
  }
})(request, response);
