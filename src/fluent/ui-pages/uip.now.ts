import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import htmlPage from '../../client/index.html'

UiPage({
    $id: Now.ID['script-console'],
    endpoint: 'x_659318_script_console.do',
    description: 'Frontend for the Script Console application',
    category: 'general',
    html: htmlPage,
    direct: true,
})