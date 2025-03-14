import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'subremoteapp',
  exposes: {
    './Routes': 'apps/subremoteapp/src/app/remote-entry/entry.routes.ts',
    './EntryComponent': 'apps/subremoteapp/src/app/remote-entry/entry.component.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
