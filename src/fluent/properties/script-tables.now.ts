import { Property } from '@servicenow/sdk/core';

Property({
  $id: Now.ID['sc-script-tables'],
  name: 'x_659318_script.script_tables',
  description: `Map the tables you would like to be able to edit scripts for in the Script Console. Must parse to valid JSON.

Each item should be the table name mapped to an object:

{
  table: Database table name
  label: Display label for the table
  display: Array of fields to show when selecting a record from the table
  field: The scripted field you want to be editable in script console
}`,
  roles: {
    read: ['admin'],
    write: ['admin'],
  },
  ignoreCache: true,
  isPrivate: false,
  value: `{
    "sys_script_include": {
      "table": "sys_script_include",
      "label": "Script Include",
      "display": ["name"],
      "field": "script"
    },
    "sys_script": {
      "table": "sys_script",
      "label": "Business Rule",
      "field": "script",
      "display": ["name"]
    },
    "sys_script_client": {
      "table": "sys_script_client",
      "label": "Client Script",
      "field": "script",
      "display": ["name", "sys_scope", "type"]
    },
    "sys_ui_script": {
      "table": "sys_ui_script",
      "label": "UI Script",
      "field": "script",
      "display": ["name"]
    },
    "catalog_script_client": {
      "table": "catalog_script_client",
      "label": "Catalog Client Script",
      "field": "script",
      "display": ["name", "sys_scope", "type"]
    },
    "sys_ui_action": {
      "table": "sys_ui_action",
      "label": "UI Action",
      "field": "script",
      "display": ["name"]
    },
    "sysauto_script": {
      "table": "sysauto_script",
      "label": "Scheduled Job",
      "field": "script",
      "display": ["name"]
    },
    "sp_angular_provider": {
      "table": "sp_angular_provider",
      "label": "Angular Provider",
      "field": "script",
      "display": ["name"]
    },
    "sp_css": {
      "table": "sp_css",
      "label": "ServicePortal CSS",
      "field": "css",
      "display": ["name"]
    },
    "sysevent_script_action": {
      "table": "sysevent_script_action",
      "label": "Script Action",
      "field": "script",
      "display": ["name"]
    },
    "sys_ws_operation": {
      "table": "sys_ws_operation",
      "label": "REST Endpoint",
      "field": "operation_script",
      "display": ["name"]
    }
  }`,
});
