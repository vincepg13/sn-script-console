(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  if (!gs.hasRole('admin')) return response.setError(new sn_ws_err.BadRequestError('Unauthorised'));

  const grWidget = new GlideRecordSecure('sp_widget');
  grWidget.addNotNullQuery('name');
  grWidget.orderByDesc('sys_updated_on');
  grWidget.setLimit(16);
  grWidget.query();

  const widgets = [];
  const utils = new ScriptConsoleUtils();

  while (grWidget.next()) {
    widgets.push({
      name: grWidget.getDisplayValue('name'),
      id: grWidget.getValue('id'),
      guid: grWidget.getUniqueValue(),
      scope: grWidget.getDisplayValue('sys_scope'),
      updater: utils.sgu.getLastUpdated(grWidget),
    });
  }

  return response.setBody({
    widgets,
  });
})(request, response);
