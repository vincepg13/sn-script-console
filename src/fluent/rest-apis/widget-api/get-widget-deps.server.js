(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const widgetId = request.pathParams.widget;
  const table = request.pathParams.table;
  const displayField = request.pathParams.field;

  if (!table || !widgetId || !displayField) {
    return response.setError(new sn_ws_err.BadRequestError('A valid widget ID and dependency table must be provided.'));
  }

  const util = new ScriptConsoleUtils();
  const dependencies = util.getWidgetDependencies(table, widgetId, displayField);
  return response.setBody({ dependencies });
  
})(request, response);
