(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const counts = new ScriptConsoleUtils().getDependencyCounts(request.pathParams.widget);
  return response.setBody({ ...counts });
})(request, response);
