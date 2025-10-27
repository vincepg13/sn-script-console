(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const table = request.pathParams.table;
  const sgu = new global.ScriptConsoleG();
  const displayField = sgu.getReferenceDisplay(table);

  if (!displayField) {
    return response.setError(new sn_ws_err.BadRequestError('Invalid table provided'));
  }

  response.setStatus(200);
  response.setBody({ display: sgu.getReferenceDisplay(table) });
})(request, response);