(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const formatter = request.body.data.formatter;
  const macro = request.body.data.macro;
  const widget = request.body.data.widget;
  const table = request.body.data.table;

  if (!formatter || !macro || !table || !widget) {
    return response.setError(
      new sn_ws_err.BadRequestError(
        'A formatter label and name, as well as a valid table and widget should be provided'
      )
    );
  }

  const sgu = new global.ScriptConsoleG();

  const grFormatterWidget = sgu.getGlobalGr('sp_widget', true);
  sgu.grMethod(grFormatterWidget, 'setValue', ['name', widget]);
  const widgetId = sgu.grMethod(grFormatterWidget, 'insert');

  const grFormatter = sgu.getGlobalGr('sys_ui_formatter', true);
  sgu.grMethod(grFormatter, 'setValue', ['name', formatter]);
  sgu.grMethod(grFormatter, 'setValue', ['macro', macro]);
  sgu.grMethod(grFormatter, 'setValue', ['table', table]);
  const uiFormatter = sgu.grMethod(grFormatter, 'insert');

  var grSPFormatter = sgu.getGlobalGr('sp_ui_formatter', true);
  sgu.grMethod(grSPFormatter, 'setValue', ['widget', widgetId]);
  sgu.grMethod(grSPFormatter, 'setValue', ['formatter', macro]);
  const spFormatter = sgu.grMethod(grSPFormatter, 'insert');

  return response.setBody({ widgetId, uiFormatter, spFormatter });
})(request, response);
