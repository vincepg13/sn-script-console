import { ScriptTableItems } from '@/types/app';
import { CmThemeValue } from 'sn-shadcn-kit/script';
import { LintLevel, ObjectWrap, TrailingComma } from '@/types/script';
import {
  AppWindow,
  BadgePlus,
  CloudUpload,
  FolderCog,
  List,
  ListPlus,
  SquareArrowOutUpRightIcon,
  SquareCode,
} from 'lucide-react';

export const instanceURI =
  import.meta.env.MODE === 'development' ? import.meta.env.VITE_DEV_URL : window.location.origin;

//Preference Keys
export const sidebarPrefKey = 'script_console.sidebar_open';
export const packagePref = 'script_console.current_package';
export const packagePrefix = 'script_console.package.';
export const prettierPrefKey = 'script_console.prettier_config';
export const eslintPrefKey = 'script_console.eslint_config';
export const cmThemeKey = 'script_console.codemirror_theme';
export const autoScopeSwitchKey = 'script_console.scope_switch';
export const autoPackageAddKey = 'script_console.package_add';
export const directToWidgetKey = 'script_console.direct_widget';
export const openWidgetColumnsKey = 'script_console.widget_columns_open';

//Application / Update Set Pickers
export const globalScope = { display_value: 'Global', value: 'global' };

export const applicationOptions = [
  { label: 'View Current', href: `${instanceURI}/sys_scope.do?sys_id={target}`, target: '_blank', icon: AppWindow },
  { label: 'View All', href: `${instanceURI}/sys_scope_list.do`, target: '_blank', icon: List },
  { label: 'ServiceNow Studio', href: `${instanceURI}/now/servicenow-studio`, target: '_blank', icon: SquareCode },
  {
    label: 'Open in Studio (legacy)',
    href: `${instanceURI}/$studio.do?sysparm_nostack=true&sysparm_use_polaris=false&sysparm_transaction_scope={target}`,
    target: '_blank',
    icon: SquareArrowOutUpRightIcon,
  },
];

export const updateSetOptions = [
  { label: 'Create New', href: `${instanceURI}/sys_update_set.do?sys_id=-1`, target: '_blank', icon: BadgePlus },
  {
    label: 'View Current',
    href: `${instanceURI}/sys_update_set.do?sys_id={target}`,
    target: '_blank',
    icon: FolderCog,
  },
  { label: 'View All', href: `${instanceURI}/sys_update_set_list.do`, target: '_blank', icon: List },
  { label: 'View Retrieved', href: `${instanceURI}/sys_remote_update_set_list.do`, target: '_blank', icon: ListPlus },
  {
    label: 'Import From XML',
    href: `${instanceURI}/upload.do?sysparm_referring_url=sys_remote_update_set_list.do&sysparm_target=sys_remote_update_set`,
    target: '_blank',
    icon: CloudUpload,
  },
];

//Prettier/Linting/Theme
type CommaOption = { value: TrailingComma; label: string };
export const commaOptions: CommaOption[] = [
  { value: 'none', label: 'Never' },
  { value: 'es5', label: 'Where Valid (ES5)' },
  { value: 'all', label: 'Wherever Possible' },
];

type ObjectWrapOption = { value: ObjectWrap; label: string };
export const objectWrapOptions: ObjectWrapOption[] = [
  { value: 'preserve', label: 'Preserve' },
  { value: 'collapse', label: 'Collapse' },
];

type LintLevelOption = { value: LintLevel; label: string };
export const defaultLintLevels: LintLevelOption[] = [
  { value: 'off', label: 'Off' },
  { value: 'warn', label: 'Warn' },
  { value: 'error', label: 'Error' },
];

type ThemeOption = { value: CmThemeValue; label: string };
export const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'VS Code Light' },
  { value: 'dark', label: 'VS Code Dark' },
  { value: 'atom', label: 'Atom One' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'androidstudio', label: 'Android Studio' },
  { value: 'copilot', label: 'GitHub Copilot' },
];

//Widget Related
export const depTableMap = {
  m2m_sp_widget_dependency: {
    label: 'Dependencies',
    desc: 'Include external javascript or css dependencies in your widget.',
    linkTable: 'sp_dependency',
    linkField: 'name',
  },
  m2m_sp_ng_pro_sp_widget: {
    label: 'Angular Providers',
    desc: 'Manage your widgets factories, services and directives ',
    linkTable: 'sp_angular_provider',
    linkField: 'name',
  },
  sp_ng_template: {
    label: 'HTML Templates',
    desc: 'Add aditional html templates to your widget.',
    linkTable: 'sp_ng_template',
    linkField: 'id',
  },
};

export const versionFields = ['sys_recorded_at', 'sys_created_by', 'state', 'source', 'reverted_from', 'sys_id'];

export const optionSections = ['Data', 'Behavior', 'Documentation', 'Presentation', 'other'] as const;
export const optionTypes = [
  'string',
  'boolean',
  'integer',
  'reference',
  'choice',
  'field_name',
  'field_list',
  'glide_list',
  'glyphicon',
] as const;

/** BACKUP CONFIG
 *
 * The below config is stored in system properties as JSON strings on the instance.
 *
 * The below will only be used if the system property is not set or fails to parse to JSON.
 */
export const fallbackStatsTables = [
  'sys_script_include',
  'sys_script',
  'sys_script_client',
  'sp_widget',
];

export const fallbackMenuItems = [
  {
    label: 'Client Scripts',
    icon: 'Braces',
    type: 'single',
    items: [
      {
        title: 'Client Scripts',
        href: '/list/sys_script_client?query=sys_class_name=sys_script_client',
        description: 'Manage client scripts to run JavaScript in forms and catalog items.',
      },
      {
        title: 'Catalog Client Scripts',
        href: '/list/catalog_script_client',
        description: 'Manage client scripts to run JavaScript in forms and catalog items.',
      },
      {
        title: 'UI Scripts',
        href: '/list/sys_ui_script',
        description:
          'Package client-side JavaScript to be reused and executed from client scripts and other client side objects.',
      },
    ],
  },
  {
    label: 'Server Scripts',
    icon: 'Server',
    type: 'multi',
    items: [
      {
        title: 'Script Includes',
        href: '/list/sys_script_include',
        description: 'Use script includes to keep your server code centralised and reusable.',
      },
      {
        title: 'Business Rules',
        href: '/list/sys_script',
        description: 'Respond to database updates with business logic that runs on the server.',
      },
      {
        title: 'UI Actions',
        href: '/list/sys_ui_action',
        description: 'Handle submission actions, links, and context menu items for forms and lists.',
      },
      {
        title: 'Scheduled Jobs',
        href: '/list/sysauto_script',
        description: 'Manage automated scripts that can be scheduled to run at specific times or intervals.',
      },
      {
        title: 'Script Actions',
        href: '/list/sysevent_script_action',
        description: 'Scripted logic that executes in response to specific events within the platform.',
      },
      {
        title: 'Scripted REST Endpoints',
        href: '/list/sys_ws_operation',
        description: 'Define your own scripted REST endpoints to handle incoming requests.',
      },
      {
        title: 'Workflow Editor (Legacy)',
        href: `${instanceURI}/workflow_ide.do?sysparm_nostack=true&sysparm_use_polaris=false`,
        target: '_blank',
        description: 'Go to the legacy workflow editor to create and manage automated workflows.',
      },
      {
        title: 'Flow Designer',
        href: `${instanceURI}/now/workflow-studio/home/flow`,
        target: '_blank',
        description: 'Go to flow designer to create and manage automated workflows.',
      },
    ],
  },
  {
    label: 'Service Portal',
    icon: 'Code2',
    type: 'multi',
    items: [
      {
        title: 'CSS',
        href: '/list/sp_css',
        description: 'Add custom CSS to your service portal to change the look and feel of your site.',
      },
      {
        title: 'Angular Providers',
        href: '/list/sp_angular_provider',
        description: 'Manage reusable AngularJS code including factories, services and directives.',
      },
      {
        title: 'Widget Editor',
        href: '/widget_editor',
        description: 'Enhanced editor for Service Portal widgets with additional features.',
      },
    ],
  },
];

export const fallbackScriptTables: NonNullable<ScriptTableItems> = {
  sys_script_include: { table: 'sys_script_include', label: 'Script Include', display: ['name'], field: 'script' },
  sys_script: { table: 'sys_script', label: 'Business Rule', field: 'script', display: ['name'] },
  sys_script_client: {
    table: 'sys_script_client',
    label: 'Client Script',
    field: 'script',
    display: ['name', 'sys_scope', 'type'],
  },
  catalog_script_client: {
    table: 'catalog_script_client',
    label: 'Catalog Client Script',
    field: 'script',
    display: ['name', 'sys_scope', 'type'],
  },
  sys_ui_action: { table: 'sys_ui_action', label: 'UI Action', field: 'script', display: ['name'] },
  sysauto_script: { table: 'sysauto_script', label: 'Scheduled Job', field: 'script', display: ['name'] },
  sp_angular_provider: { table: 'sp_angular_provider', label: 'Angular Provider', field: 'script', display: ['name'] },
  sp_css: { table: 'sp_css', label: 'ServicePortal CSS', field: 'css', display: ['name'] },
  sysevent_script_action: {
    table: 'sysevent_script_action',
    label: 'Script Action',
    field: 'script',
    display: ['name'],
  },
  sys_ws_operation: { table: 'sys_ws_operation', label: 'REST Endpoint', field: 'operation_script', display: ['name'] },
};
