(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const table = request.pathParams.table;
  const gr = new GlideRecord(table);

  if (!gr.isValid(table)) {
    return response.setError(new sn_ws_err.BadRequestError('A valid table name must be provided.'));
  }

  const query = request.queryParams.query || '';
  const page = +(request.queryParams.page || 0);
  const pageSize = +(request.queryParams.pageSize || 10);

  const tableData = new global.ScriptConsoleG().getTableData(gr, page, pageSize, query);
  response.setBody(tableData);
})(request, response);
