import { Acl } from "@servicenow/sdk/core";

export default Acl({
    $id: Now.ID['sc-ui-page-acl'],
    active: true,
    adminOverrides: true,
    type: 'ui_page',
    operation: 'read',
    name: 'x_659318_script_console',
    roles: ['admin'],
})