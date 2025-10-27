(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const table = request.pathParams.table;
  const guid = request.pathParams.id;
  const field = request.pathParams.field;

  const util = new ScriptConsoleUtils();
  const scriptData = util.sgu.getScriptData(table, guid, field);

  if (!scriptData) {
    return response.setError(
      new sn_ws_err.NotFoundError('Record does not exist or you do not have access to view it.')
    );
  }

  const body = { ...scriptData };
  const autoPack = util.autoPack(table, `/script/${table}/${guid}`);
  if (autoPack) body.packageValue = autoPack;

  response.setStatus(200);
  response.setBody(body);
})(request, response);
