import { RestApi } from '@servicenow/sdk/core';

RestApi({
  $id: Now.ID['sc-package'],
  name: 'Script Console Package API',
  serviceId: 'console_package',
  consumes: 'application/json',
  routes: [
    {
      $id: Now.ID['sc-package-create'],
      name: 'Create Package',
      method: 'POST',
      script: Now.include('./create-package.server.js'),
      consumes: 'application/json',
      produces: 'application/json,application/xml,text/xml',
      path: '/create',
    },
    {
      $id: Now.ID['sc-package-add'],
      name: 'Add to Package',
      method: 'PUT',
      script: Now.include('./append-item.server.js'),
      consumes: 'application/json',
      produces: 'application/json,application/xml,text/xml',
      path: '/add_item',
    },
    {
      $id: Now.ID['sc-package-change'],
      name: 'Change Package',
      method: 'PUT',
      script: Now.include('./change-package.server.js'),
      consumes: 'application/json',
      produces: 'application/json,application/xml,text/xml',
      path: '/change',
    },
  ],
});
