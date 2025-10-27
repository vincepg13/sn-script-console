(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const guid = request.pathParams.id;
  const grWidget = new GlideRecordSecure('sp_widget');
  const fields = ['name', 'id', 'template', 'css', 'client_script', 'script', 'link', 'option_schema'];

  if (grWidget.get(guid)) {
    const data = {};
    const util = new ScriptConsoleUtils();
    gs.getUser().savePreference('script_console.widget', guid);

    const scopeChange = util.sgu.autoScopeSwitch(grWidget);
    data.scopeChange = scopeChange;

    const autoPack = util.autoPack('sp_widget', `/widget_editor/${guid}`);
    if (autoPack) data.packageValue = autoPack;

    data.guid = guid;
    data.jsVersion = grWidget.sys_scope.js_level.toString();
    data.fields = util.sgu.$sp.getFieldsObject(grWidget, fields.join(','));

    for (const [fieldName, fieldData] of Object.entries(data.fields)) {
      fieldData.canWrite = grWidget[fieldName].canWrite();
    }

    data.toggleButtons = [
      { label: 'HTML', field: 'template', parser: 'html', visible: true },
      { label: 'CSS', field: 'css', parser: 'scss', visible: false },
      { label: 'Client', field: 'client_script', parser: 'babel', visible: true },
      { label: 'Server', field: 'script', parser: 'babel', visible: true },
      { label: 'Link', field: 'link', visible: false }
    ];

    data.toggleButtons.forEach(function (b) {
      data.fields[b.field].visible = b.visible;
    });

    data.security = {
      canWrite: grWidget.canWrite(),
      canDelete: grWidget.canDelete()
    };

    ((data.esVersion = util.sgu.getEsMode(grWidget, 'sp_widget', grWidget.getUniqueValue())),
      (data.dependencyCounts = new ScriptConsoleUtils().getDependencyCounts(data.guid)));
    return response.setBody({ data });
  }

  return response.setError(new sn_ws_err.BadRequestError('A valid widget ID must be provided.'));
})(request, response);
