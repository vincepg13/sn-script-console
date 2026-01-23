(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.isLoggedIn()) {
    response.setStatus(401);
    return response.setBody({ error: 'Not authenticated' });
  }

  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));
  return response.setBody({ token: gs.getSession().getSessionToken() });
})(request, response);
