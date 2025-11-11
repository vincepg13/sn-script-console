(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));

  const counts = new ScriptConsoleUtils().getDependencyCounts(request.pathParams.widget);
  return response.setBody({ ...counts });
})(request, response);
