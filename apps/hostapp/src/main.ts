import { init } from '@module-federation/enhanced/runtime';

fetch('/module-federation.manifest.json')
  .then((res) => res.json())
  .then((remotes: Record<string, string>) =>
    Object.entries(remotes).map(([name, entry]) => ({ name, entry }))
  )
  .then((remotes) => {
    init({ name: 'hostapp', remotes });
    const remoteappremotes = remotes.filter(
      (remote) => remote.name === 'subremoteapp'
    );
    init({ name: 'remoteapp', remotes: remoteappremotes });
  })
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
