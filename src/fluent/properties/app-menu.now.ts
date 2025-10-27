import { Property } from '@servicenow/sdk/core';

Property({
  $id: Now.ID['sc-app-menu'],
  name: 'x_659318_script.app_menu',
  description: 'Customisable application menu for Script Console application. Must parse to valid JSON.',
  roles: {
    read: ['admin'],
    write: ['admin'],
  },
  ignoreCache: true,
  isPrivate: false,
  value: `[{
    "label": "Client Scripts",
    "icon": "Braces",
    "type": "single",
    "items": [
      {
        "title": "Client Scripts",
        "href": "/list/sys_script_client?query=sys_class_name=sys_script_client",
        "description": "Manage client scripts to run JavaScript in forms and catalog items."
      },
      {
        "title": "Catalog Client Scripts",
        "href": "/list/catalog_script_client",
        "description": "Manage client scripts to run JavaScript in forms and catalog items."
      },
      {
        "title": "UI Scripts",
        "href": "/list/sys_ui_script",
        "description": "Package client-side JavaScript to be reused and executed from client scripts and other client side objects."
      }
    ]
  },
  {
    "label": "Server Scripts",
    "icon": "Server",
    "type": "multi",
    "items": [
      {
        "title": "Script Includes",
        "href": "/list/sys_script_include",
        "description": "Use script includes to keep your server code centralised and reusable."
      },
      {
        "title": "Business Rules",
        "href": "/list/sys_script",
        "description": "Respond to database updates with business logic that runs on the server."
      },
      {
        "title": "UI Actions",
        "href": "/list/sys_ui_action",
        "description": "Handle submission actions, links, and context menu items for forms and lists."
      },
      {
        "title": "Scheduled Jobs",
        "href": "/list/sysauto_script",
        "description": "Manage automated scripts that can be scheduled to run at specific times or intervals."
      },
      {
        "title": "Script Actions",
        "href": "/list/sysevent_script_action",
        "description": "Scripted logic that executes in response to specific events within the platform."
      },
      {
        "title": "Scripted REST Endpoints",
        "href": "/list/sys_ws_operation",
        "description": "Define your own scripted REST endpoints to handle incoming requests."
      },
      {
        "title": "Workflow Editor (Legacy)",
        "href": "INSTANCE_URI/workflow_ide.do?sysparm_nostack=true&sysparm_use_polaris=false",
        "target": "_blank",
        "description": "Go to the legacy workflow editor to create and manage automated workflows."
      },
      {
        "title": "Flow Designer",
        "href": "INSTANCE_URI/now/workflow-studio/home/flow",
        "target": "_blank",
        "description": "Go to flow designer to create and manage automated workflows."
      }
    ]
  },
  {
    "label": "Service Portal",
    "icon": "Code2",
    "type": "multi",
    "items": [
    {
        "title": "CSS",
        "href": "/list/sp_css",
        "description": "Add custom CSS to your service portal to change the look and feel of your site."
      },
      {
        "title": "Angular Providers",
        "href": "/list/sp_angular_provider",
        "description": "Manage reusable AngularJS code including factories, services and directives."
      },
      {
        "title": "Widget Editor",
        "href": "/widget_editor",
        "description": "Enhanced editor for Service Portal widgets with additional features."
      }
    ]
  }]`,
});