import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponent },
  {
    path: 'subremoteapp',
    loadChildren: () =>
      loadRemote<typeof import('subremoteapp/Routes')>(
        'subremoteapp/Routes'
      ).then((m) => m!.remoteRoutes),
  },
];
