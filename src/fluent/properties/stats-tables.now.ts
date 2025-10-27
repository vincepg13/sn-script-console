import { Property } from '@servicenow/sdk/core';

Property({
  $id: Now.ID['sc-stats-tables'],
  name: 'x_659318_script.stats_tables',
  description:
    'Comma separated string of table names which will display in the "My Script Stats" section on the script console homepage.',
  roles: {
    read: ['admin'],
    write: ['admin'],
  },
  ignoreCache: true,
  isPrivate: false,
  value: 'sys_script_include,sys_script,sys_script_client,sp_widget',
});
