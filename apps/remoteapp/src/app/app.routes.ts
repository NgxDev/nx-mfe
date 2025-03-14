import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: 'subremoteapp',
    loadChildren: () =>
      loadRemote<typeof import('subremoteapp/Routes')>(
        'subremoteapp/Routes'
      ).then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
];
