import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponent },
  {
    path: 'subremoteapp',
    component: RemoteEntryComponent,
    loadChildren: () =>
      loadRemote<typeof import('subremoteapp/Routes')>(
        'subremoteapp/Routes'
      ).then((m) => m!.remoteRoutes),
    /*children: [
      {
        path: '',
        loadComponent: () =>
          loadRemote<typeof import('subremoteapp/EntryComponent')>(
            'subremoteapp/EntryComponent'
          ).then((m) => m!.RemoteEntryComponent),
      },
    ],*/
  },
];
