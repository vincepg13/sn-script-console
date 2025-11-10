(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));

  const guid = request.pathParams.id;
  const util = new ScriptConsoleUtils();
  const sgu = util.sgu;

  const grPolicy = sgu.getGlobalGr('sys_ui_policy');
  if (!sgu.grMethod(grPolicy, 'get', [guid])) {
    return response.setError(new sn_ws_err.NotFoundError('UI Policy could not be found.'));
  }

  const grAction = sgu.getGlobalGr('sys_ui_policy_action');
  grAction.addQuery('ui_policy', guid);
  grAction.orderByDesc('sys_updated_on');
  sgu.grMethod(grAction, 'query');

  const actions = [];
  const getValuePair = (gr, fieldName) => ({
    value: sgu.grMethod(gr, 'getValue', [fieldName]),
    displayValue: sgu.grMethod(gr, 'getDisplayValue', [fieldName]),
  });

  while (grAction.next()) {
    actions.push({
      guid: grAction.getUniqueValue(),
      field: getValuePair(grAction, 'field'),
      mandatory: getValuePair(grAction, 'mandatory'),
      visible: getValuePair(grAction, 'visible'),
      disabled: getValuePair(grAction, 'disabled'),
      cleared: getValuePair(grAction, 'cleared'),
    });
  }

  const policy = {
    guid,
    actions: actions,
    table: sgu.grMethod(grPolicy, 'getValue', ['table']),
    scope: sgu.grMethod(grPolicy, 'getValue', ['sys_scope']),
    name: sgu.grMethod(grPolicy, 'getDisplayValue', ['short_description']),
  };

  const scopeChange = sgu.autoScopeSwitch(grPolicy);
  if (scopeChange) policy.scopeChange = scopeChange;

  const autoPack = util.autoPack('sys_ui_policy', `/policy/${guid}`);
  if (autoPack) policy.packageValue = autoPack;

  response.setStatus(200);
  response.setBody(policy);
})(request, response);
