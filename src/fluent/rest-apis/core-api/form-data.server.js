(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const table = request.pathParams.table;
  const guid = request.pathParams.id;
  const qry = request.queryParams.qry || '';
  const view = request.queryParams.view || '';

  const util = new ScriptConsoleUtils();
  const sgu = util.sgu;

  var grTarget = sgu.getGlobalGr(table);
  if (guid == -1 && !sgu.grMethod(grTarget, 'canCreate'))
    return response.setError(
      new sn_ws_err.BadRequestError('You do not have access to create a record of this type')
    );
  if (guid != -1 && !sgu.grMethod(grTarget, 'get', [guid]))
    return response.setError(new sn_ws_err.BadRequestError('Record not found.'));
  if (guid != -1 && !sgu.grMethod(grTarget, 'canRead'))
    return response.setError(
      new sn_ws_err.BadRequestError('You are not authorised to view this record.')
    );

  const esVersion = sgu.getEsMode(grTarget, table, guid);
  const instanceURI = gs.getProperty('glide.servlet.uri');
  const formData = sgu.getGlideForm(table, guid, qry, view);
  const hasActivityFormatter = util.hasActivity(formData._formatters);

  if (!!hasActivityFormatter && guid != -1) {
    formData.activity = sgu.getActivityData(table, guid, instanceURI);
    formData.activity.formatter = hasActivityFormatter;
  }

  formData.attachments = sgu.getAttachments(table, guid, instanceURI);
  util.modifyFields(formData._fields, formData.activity);
  sgu.modifyPolicies(formData.policy, grTarget);

  let prettierConfig = util.getPrettierConfig();

  formData.react_config = {
    user: gs.getUserID(),
    base_url: instanceURI,
    glide_user: sgu.getGlideUser(),
    scope: util.getScopeName(table),
    security: sgu.getSecurity(grTarget),
    date_format: sgu.getUserDateFormat(),
    theme: gs.getUser().getPreference('script_console.codemirror_theme') || 'atom',
    prettier: prettierConfig,
    es_lint: util.getLintingConfig(esVersion)
  };

  response.setStatus(200);
  response.setBody(formData);
})(request, response);
