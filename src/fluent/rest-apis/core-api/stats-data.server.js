(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const util = new ScriptConsoleUtils();
  const fallbackTables = request.queryParams.tables;

  if (!fallbackTables) {
    return response.setError(new sn_ws_err.BadRequestError('Tables parameter must be included.'));
  }

  const tablesByProp = gs.getProperty('x_659318_script.stats_tables');
  const tables = [
    ...new Set(
      (tablesByProp || fallbackTables)
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    )
  ];

  const stats = util.getDeveloperStats(tables);
  response.setBody({ tableCounts: stats });
})(request, response);
