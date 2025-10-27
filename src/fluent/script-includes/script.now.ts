import { ScriptInclude } from '@servicenow/sdk/core';

ScriptInclude({
  $id: Now.ID['script-console-helper'],
  name: 'ScriptConsoleUtils',
  active: true,
  apiName: 'x_659318_script.ScriptConsoleUtils',
  script: Now.include('./script-utils.server.js'),
  description: 'Utility methods for the script console application',
  clientCallable: false,
  mobileCallable: false,
  sandboxCallable: false,
});
