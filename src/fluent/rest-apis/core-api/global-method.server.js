(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));

  const methodName = request.pathParams.name;
  const params = request.body.data.params || [];

  const allowList = [
    'revertVersion',
    'setCurrentScope',
    'setCurrentUpdateSet',
    'refreshScope',
    'setListMechanic',
    'savePolicyActions'
  ];

  if (!gs.hasRole('admin') || !allowList.includes(methodName)) {
    return response.setError(new sn_ws_err.BadRequestError('This method could not be invoked'));
  }

  const sgu = new global.ScriptConsoleG();
  return response.setBody({ returned: sgu[methodName](...params) });
})(request, response);
