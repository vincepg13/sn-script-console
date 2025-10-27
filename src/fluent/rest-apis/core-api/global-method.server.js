(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const methodName = request.pathParams.name;
  const params = request.body.data.params || [];

  const allowList = ["revertVersion", "setCurrentScope", "setCurrentUpdateSet", "refreshScope"];
  if (!allowList.includes(methodName)) {
    return response.setError(new sn_ws_err.BadRequestError('This method could not be invoked'));
  }

  const sgu = new global.ScriptConsoleG();
  return response.setBody({returned: sgu[methodName](...params)});
})(request, response);
