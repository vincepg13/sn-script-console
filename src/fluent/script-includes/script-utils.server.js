var ScriptConsoleUtils = Class.create();

ScriptConsoleUtils.prototype = {
  initialize: function () {
    this.sgu = new global.ScriptConsoleG();
  },

  DefaultPrettierOptions: {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 100,
    bracketSpacing: true,
    arrowParens: 'avoid',
    objectWrap: 'preserve',
    formatOnSave: false
  },

  defaultLintRules: {
    semi: ['warn', 'always'],
    'no-unused-vars': ['warn', { args: 'after-used' }],
    'no-unreachable': 'error',
    'no-redeclare': 'error',
    'no-dupe-keys': 'warn',
    'no-irregular-whitespace': 'warn',
    'valid-typeof': 'error',
    'use-isnan': 'error'
  },

  getSimpleCount(table, query) {
    const ga = new GlideAggregate(table);
    ga.addQuery(query);
    ga.addAggregate('COUNT');
    ga.query();

    return ga.next() ? +ga.getAggregate('COUNT') : 0;
  },

  getDeveloperStats(statsTables) {
    const createdQry = `sys_created_by=${gs.getUserName()}`;
    const updatedQry = `sys_updated_onRELATIVEGT@dayofweek@ago@30^sys_updated_by=${gs.getUserName()}`;

    return statsTables.map(table => {
      const gr = new GlideRecord(table);

      return {
        table,
        title: gr.getClassDisplayValue(),
        items: [
          {
            query: updatedQry,
            subtext: 'Updated within last 30 days',
            count: this.sgu.getSimpleCount(table, updatedQry)
          },
          {
            query: createdQry,
            subtext: 'Created by me',
            count: this.sgu.getSimpleCount(table, createdQry)
          }
        ]
      };
    });
  },

  // Widget support methods
  getDependencyCounts(widgetId) {
    return {
      dependencies: this.getSimpleCount('m2m_sp_widget_dependency', 'sp_widget=' + widgetId),
      providers: this.getSimpleCount('m2m_sp_ng_pro_sp_widget', 'sp_widget=' + widgetId),
      templates: this.getSimpleCount('sp_ng_template', 'sp_widget=' + widgetId)
    };
  },

  getWidgetDependencies(table, widgetId, displayField) {
    const dependencies = [];

    const grDep = new GlideRecord(table);
    grDep.addQuery('sp_widget', widgetId);
    grDep.orderBy('sys_created_on');
    grDep.query();

    while (grDep.next()) {
      const depId = grDep.getUniqueValue();
      const dependencyDisplay = grDep.getDisplayValue(displayField);
      const grUser = this.sgu.getUserViaUsername(grDep.getValue('sys_created_by'));
      const createdOn = this.sgu.getFormattedDate(grDep.getValue('sys_created_on'));

      if (dependencyDisplay) {
        dependencies.push({
          depId,
          name: dependencyDisplay,
          created: grUser ? `${createdOn}, ${grUser.getDisplayValue()}` : createdOn,
          value: table == 'sp_ng_template' ? depId : grDep[displayField].toString(),
          linkTable: table == 'sp_ng_template' ? 'sp_ng_template' : grDep[displayField].sys_class_name.toString()
        });
      }
    }
    return dependencies;
  },

  //Form support methods
  hasActivity(formatters) {
    for (const f in formatters) {
      let formatterName = formatters[f].formatter;
      if (formatterName === 'activity.xml') {
        return f;
      }
    }

    return false;
  },

  getScopeName(table) {
    const grDb = new GlideRecord('sys_db_object');
    if (grDb.get('name', table)) {
      return grDb.sys_scope.scope.toString();
    }
  },

  modifyFields(fields, activityData) {
    for (const f in fields) {
      const field = fields[f];

      if (field.type === 'glide_date' || field.type == 'glide_date_time') {
        if (field.value) {
          const gd = field.type == 'glide_date' ? new GlideDate() : new GlideDateTime();
          gd.setDisplayValue(field.value);
          field.value = gd.getValue();
        }
      }

      if (activityData && field.type == 'journal_input') {
        field.visible = false;
        if (activityData.readable && !activityData.readable.includes(field.name)) {
          activityData.journal_fields.push({
            can_read: true,
            can_write: !field.readonly,
            color: 'transparent',
            label: field.label,
            name: field.name
          });

          activityData.readable.push(field.name);
          if (!field.readonly) activityData.writeable.push(field.name);
        }
      }
    }
  },

  getPrettierConfig() {
    let config = this.DefaultPrettierOptions;
    try {
      const prettierPref = gs.getUser().getPreference('script_console.prettier_config');
      if (prettierPref) config = JSON.parse(prettierPref);
    } catch (e) {
      gs.info('Error parsing prettier config, falling back to default');
    }

    return config;
  },

  getLintingConfig(jsVersion) {
    const config = {
      rules: this.defaultLintRules || {},
      languageOptions: {
        parserOptions: {
          ecmaVersion: jsVersion || 5,
          sourceType: 'script'
        }
      }
    };

    try {
      const lintingPref = gs.getUser().getPreference('script_console.eslint_config');
      if (lintingPref) config.rules = JSON.parse(lintingPref);
    } catch (e) {
      gs.info('Error parsing linting config, falling back to default');
    }

    return config;
  },

  //Package Building Methods (preferences referenced by GR to avoid caching issues)
  getDirectPref(pref, user) {
    const grPref = this.sgu.getGlobalGr('sys_user_preference');
    grPref.addQuery('name', pref);
    grPref.addQuery('user', user || gs.getUserID());
    grPref.query();

    return grPref;
  },

  getMyPackages() {
    const grPref = new GlideRecord('sys_user_preference');
    grPref.addQuery('user', gs.getUserID());
    grPref.addQuery('name', 'STARTSWITH', 'script_console.package.');
    grPref.orderBy('name');
    grPref.query();

    const packages = [];
    while (grPref.next()) {
      packages.push({
        name: grPref.getValue('description'),
        id: grPref.getValue('name'),
        guid: grPref.getUniqueValue()
      });
    }

    return packages;
  },

  getPackageItems(propId) {
    const grPref = this.getDirectPref(propId);
    return grPref.next() ? JSON.parse(grPref.getValue('value') || '{}') : {};
  },

  autoPack(table, path) {
    const gUser = gs.getUser();

    if (gUser.getPreference('script_console.package_add') === 'true') {
      const currentPackage = gUser.getPreference('script_console.current_package');

      if (currentPackage) {
        const res = this.addToPackage(currentPackage, table, path);
        if (res.success) return res.package.packageValue;
      }
    }
  },

  addToPackage(packageId, table, path, label, guid, tableLabel) {
    const sgu = this.sgu;
    const grPref = this.getDirectPref(packageId);

    if (!grPref.next()) {
      return { success: false, error: 'Package could not be found' };
    }

    let localGuid = guid;
    let localLabel = label;
    let localTableLabel = tableLabel;

    const packageValue = JSON.parse(grPref.getValue('value') || '{}');

    if (!localGuid) {
      const pathParts = path.split('/');
      localGuid = pathParts.pop();
    }

    if (!localTableLabel || !localLabel) {
      const gr = sgu.getGlobalGr(table);
      const found = sgu.grMethod(gr, 'get', [localGuid]);

      if (!found) {
        return { success: false, error: 'Invalid item - record not found in table' };
      }

      localLabel = gr.getDisplayValue();
      localTableLabel = gr.getClassDisplayValue();
    }

    if (!packageValue[table]) {
      packageValue[table] = {
        label: localTableLabel,
        isActive: true,
        items: []
      };
    }

    const targetTable = packageValue[table];
    const exists = targetTable && targetTable.items.find(item => item.path === path);
    if (exists) return { success: false, error: 'Item already exists in package' };

    targetTable.items.push({
      label: localLabel,
      path
    });
    targetTable.items.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

    sgu.grMethod(grPref, 'setValue', ['value', JSON.stringify(packageValue)]);
    const updated = sgu.grMethod(grPref, 'update');
    return { success: true, package: { updated, packageValue } };
  },

  type: 'ScriptConsoleUtils'
};
