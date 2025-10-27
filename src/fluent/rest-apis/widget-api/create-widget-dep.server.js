(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const table = request.body.data.table;
  const widgetId = request.body.data.widget;
  const dependencyId = request.body.data.dependency;
  
  if (!table || !widgetId || !dependencyId) {
    return response.setError(new sn_ws_err.BadRequestError('A valid table, widget and dependency should be provided'));
  }

  const displayTable = request.body.data.linkTable;
  const util = new ScriptConsoleUtils();
  const sgu = util.sgu;

  const grDep = sgu.getGlobalGr(table, true);
  sgu.grMethod(grDep, 'setValue', ['sp_widget', widgetId]);
  sgu.grMethod(grDep, 'setValue', [displayTable, dependencyId]);

  const depId = sgu.grMethod(grDep, 'insert', []);

  if (!depId) {
    return response.setBody({ success: false, dependencies: [] });
  }

  const dependencies = util.getWidgetDependencies(table, widgetId, displayTable);
  return response.setBody({ success: true, dependencies });
  
})(request, response);
