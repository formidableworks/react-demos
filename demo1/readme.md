# demo1

simple create-react-app demo with update prompts (driven by a service worker).

## Quick Start

```sh
# change dir
cd demo1

# install deps.
npm install

# build the react app.
npm run build

# host static files produced in the previous step
# visit the presented url in a incognito chrome tab and open the dev tools.
npm run serve

# use an editor to update the h2 to "Service Worker Updater 2"
code ./src/App.tsx

# build the react app, again.
# note: if the current react-app polls for an update during the build
# process it will produce an error in the browsers console; the
# service worker will auto-recover.
npm run build

# after the build process has completed wait for the service-worker
# to poll the static host for an update (every 30 seconds). When an
# update is available the app should prompt the user via a snackbar component.
```

## important implementation bits.

actual implementation was fairly simple; working with service workers and understanding their lifecycle required alot of studying.

- [index.tsx](./src/index.tsx) - enables serviceworker-redux communication.
- [serviceWorkerRegistration.ts](./src/serviceWorkerRegistration.ts) - update polling.
- [swAppUpdaterSlice.ts](./src/redux/swAppUpdaterSlice.ts) - activates waiting sw and page reloading.
- [SnackbarDeployer.tsx](./src/swUpdateTest/SnackbarDeployer.tsx) - reads from redux and deploys the snackbar.

## pros and cons

- **pro** much of the functionality is already built in [create-react-app](https://create-react-app.dev/docs/making-a-progressive-web-app/).
- **pro** create-react-app's service worker implementation uses googles well tested [workbox](https://developer.chrome.com/docs/workbox/the-ways-of-workbox/) package.
- **con** service workers can cause massive cache headaches; they caused so many problems with create-react-app users, the devs switch service workers to be opt-in since v2.
- **big con** You cannot easily develop service worker as they are disabled in webpacks dev server. the developer experience has been bad. really bad.
