# demo3

simple create-react-app demo with update prompts (driven by build hashes).

## Quick Start

```sh
# change dir
cd demo3

# install deps.
npm install

# build the react app.
npm run build

# host static files produced in the previous step
# visit the presented url in a chrome tab and open the dev tools.
npm run serve

# use an editor to update the h2 to "Hash Checker 2".
# this will ensure the build will produce a different hash.
code ./src/App.tsx

# build the react app, again (in another terminal).
npm run build

# after the build process has completed wait for the next poll.
# When an update is available the app should prompt the user via a snackbar component.
```

## important implementation bits.

- [HashChecker.tsx](./src/HashChecker.tsx#L35-L74) - performs a http get request on index.html, searches for an updated hash (an update is available).

## pros and cons

- **pro** update check is dependent on index.html contents, not host tech. (index.html is guaranteed to exist on a successful deployment)
