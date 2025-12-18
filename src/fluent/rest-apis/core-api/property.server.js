(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));

  const guid = request.pathParams.id;
  const util = new ScriptConsoleUtils();
  const sgu = util.sgu;

  const grProperty = sgu.getGlobalGr('sys_properties');
  if (!sgu.grMethod(grProperty, 'get', [guid])) {
    return response.setError(new sn_ws_err.NotFoundError('System property could not be found.'));
  }

  const scopeChange = sgu.autoScopeSwitch(grProperty);
  const autoPack = util.autoPack('sys_properties', `/property/${guid}`);

  const property = {
    guid,
    canWrite: sgu.grMethod(grProperty, 'canWrite'),
    name: sgu.grMethod(grProperty, 'getValue', ['name']) || '',
    value: sgu.grMethod(grProperty, 'getValue', ['value']) || '',
    type: sgu.grMethod(grProperty, 'getValue', ['type']) || '',
    modCount: sgu.grMethod(grProperty, 'getValue', ['sys_mod_count']),
    editorType: 'text'
  };

  if (property.type == 'string') {
    const trimVal = property.value.trim();

    if (trimVal.startsWith('[') || trimVal.startsWith('{')) {
      try {
        JSON.parse(trimVal);
        property.editorType = 'json';
      } catch (e) {}
    }
  }

  if (autoPack) property.packageValue = autoPack;
  if (scopeChange) property.scopeChange = scopeChange;

  response.setStatus(200);
  response.setBody(property);
})(request, response);
