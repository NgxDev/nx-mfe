# Org

## 1 - Create workspace
  
```sh
> npx create-nx-workspace org --style=scss --unitTestRunner=jest  

  ✔ Which stack do you want to use? · angular  
  ✔ Integrated monorepo, or standalone project? · integrated  
  ✔ Application name · org  
  ✔ Which bundler would you like to use? · webpack  
  ✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? · No  
  ✔ Test runner to use for end to end (E2E) tests · none  
  ✔ Which CI provider would you like to use? · skip  
  ✔ Would you like remote caching to make your build faster? · skip 
```

## 2 - Remove existing `org` app

```sh
> nx g @nx/workspace:remove org
```

## 3 - Create a host application

```sh
> nx g @nx/angular:host apps/hostapp --style=scss --prefix=happ --dynamic=true

  ✔ Which unit test runner would you like to use? · jest  
  ✔ Which E2E test runner would you like to use? · none  
```

## 4 - Create first remote app

```sh
> nx g @nx/angular:remote apps/remoteapp --host=hostapp --style=scss --prefix=rapp

  ✔ Which unit test runner would you like to use? · jest  
  ✔ Which E2E test runner would you like to use? · none  
```

## 5 - Create second remote app (that should be loaded by the first remote app)

### 5.1 - Use the generate remote command, specifying --host=remoteapp

```sh
> nx g @nx/angular:remote apps/subremoteapp --host=remoteapp --style=scss --prefix=srapp

Error: NX   Cannot read properties of undefined (reading 'getEnd')  
```

### 5.2 - Create `apps/remoteapp/public/module-federation.manifest.json` with content `{}`

### 5.3 - Rerun the generate command

```sh
> nx g @nx/angular:remote apps/subremoteapp --host=remoteapp --style=scss --prefix=srapp

Error: NX   Cannot read properties of null (reading 'includes')
```

### 5.4 - Temporary workaround

In `node_modules/@nx/angular/src/generators/setup-mf/lib/add-remote-to-host.js:110`  
Replace line 110:

```js
if (appComponent.includes(`<ul class="remote-menu">`) &&
```

with  

```js
if (appComponent && appComponent.includes(`<ul class="remote-menu">`) &&
```

### 5.5 Rerun the generate command (this time it will be successful)

```sh
> nx g @nx/angular:remote apps/subremoteapp --host=remoteapp --style=scss --prefix=srapp
```

## 6 - Try to serve the app

```sh
> nx serve hostapp

Error: NX   Cannot find module '@rspack/core'  
```

Temporary workaound: `npm i --save-dev @rspack/core`  
(this was not an issue with a previous version of Nx, whatever latest version was available until about a week ago - before 20.5.0)

## 7 - Load subremoteapp in remoteapp

### 7.1

In `apps/remoteapp/src/main.ts` replace:  

```ts
import('./bootstrap').catch((err) => console.error(err));
```

With:

```ts
import { init } from '@module-federation/enhanced/runtime';

fetch('/module-federation.manifest.json')
  .then((res) => res.json())
  .then((remotes: Record<string, string>) =>
    Object.entries(remotes).map(([name, entry]) => ({ name, entry }))
  )
  .then((remotes) => init({ name: 'remoteapp', remotes }))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
```

### 7.2 - Add `remotes: []` im `apps/remoteapp/module-federation.config.ts`

### 7.3 - Add `<router-outlet>`, navigation links and imports in `apps/remoteapp/src/app/remote-entry/entry.component.ts`

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule, NxWelcomeComponent],
  selector: 'rapp-remoteapp-entry',
  template: `
    <hr />
    <strong>Remote App Nav:</strong>&nbsp; <a routerLink=".">Remote App</a> |
    <a routerLink="subremoteapp">SubRemote Aapp</a>
    <hr />
    <router-outlet></router-outlet>
    <rapp-nx-welcome></rapp-nx-welcome>
  `,
})
export class RemoteEntryComponent {}
```

### 7.4 - `nx build hostapp`  

Correctly sees remote dependencies and builds all apps: hostapp, remoteapp and subremoteapp

### 7.5 - `nx serve hostapp`

Try to navigate to `/remoteapp/subremoteapp` using the navigation links: `NG04002: Cannot match any routes. URL Segment: 'remoteapp/subremoteapp`  
For some reason, the subremoteapp isn't seen. There is no request to `http://localhost:4202/mf-manifest.json` when the remoteapp loads.  
Also, directly accessing `localhost:4201` (remoteapp) or `localhost:4202` (subremote app) does not work.

### 7.6 - Add 'subremoteapp' to `remotes` in `apps/hostapp/module-federation.config.ts`:

```ts
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'hostapp',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: ['subremoteapp'], // <<< Add 'subremoteapp'
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
```

### 7.7 - Run `nx serve hostapp`  

Now all apps are served. We can access `localhost:4201` (remoteapp - with navigation working, the request for subremoteapp mf-manifest.json is done correctly) and `localhost:4202` (subremoteapp).  

However, when accessing the hostapp `localhost:4200`, the same issue persists.  
When the remoteapp is loaded by hostapp, there is no request for `http://localhost:4202/mf-manifest.json` (subremoteapp manifest). So the navigation fails.  
