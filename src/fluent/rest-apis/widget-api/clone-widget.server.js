(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  const widgetId = request.pathParams.widget;
  const cloneId = request.body.data.id;
  const cloneName = request.body.data.name;

  if (!cloneName) {
    return response.setError(new sn_ws_err.BadRequestError('A valid widget name should be provided'));
  }

  const sgu = new global.ScriptConsoleG();
  const cloneFields = [
    'template',
    'script',
    'client_script',
    'link',
    'data_table',
    'field_list',
    'controller_as',
    'public',
    'css',
    'documentation',
    'demo_data',
    'has_preview',
    'option_schema',
  ];

  const grWidget = sgu.getGlobalGr('sp_widget');
  grWidget.addQuery('id', cloneId);
  grWidget.query();

  if (cloneId && grWidget.next()) {
    response.setBody({ message: 'A widget with the provided ID already exists.', guid: null });
  } else {
    const grWidgetClone = sgu.getGlobalGr('sp_widget');
    grWidgetClone.addQuery('sys_id', widgetId);
    grWidgetClone.query();

    if (grWidgetClone.next()) {
      grWidget.initialize();
      sgu.grMethod(grWidget, 'setValue', ['id', cloneId]);
      sgu.grMethod(grWidget, 'setValue', ['name', cloneName]);

      for (var f in cloneFields) {
        const field = cloneFields[f];
        sgu.grMethod(grWidget, 'setValue', [field, grWidgetClone.getValue(field)]);
      }

      const newSysID = sgu.grMethod(grWidget, 'insert');

      // dependencies
      const grDependency = sgu.getGlobalGr('m2m_sp_widget_dependency');
      grDependency.query('sp_widget', widgetId);
      while (grDependency.next()) {
        sgu.grMethod(grDependency, 'setValue', ['sp_widget', newSysID]);
        sgu.grMethod(grDependency, 'insert');
      }

      // providers
      const grProvider = sgu.getGlobalGr('m2m_sp_ng_pro_sp_widget');
      grProvider.query('sp_widget', widgetId);
      while (grProvider.next()) {
        sgu.grMethod(grProvider, 'setValue', ['sp_widget', newSysID]);
        sgu.grMethod(grProvider, 'insert');
      }

      // save cloned widget's relationship to OOB parent
      new global.SPWidgetCloneUtils().createCloneRelationship(grWidgetClone.getUniqueValue(), newSysID);
      response.setBody({ message: 'Widget cloned successfully.', guid: newSysID });
    }
  }
})(request, response);
