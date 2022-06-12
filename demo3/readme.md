# demo3

simple create-react-app demo with update prompts (driven by request failures).

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

# use an editor to update the h2 to "Main Script Checker 2".
# this will ensure the build will produce a different hash.
code ./src/App.tsx

# build the react app, again (in another terminal).
npm run build

# after the build process has completed wait for the next poll.
# When an update is available the app should prompt the user via a snackbar component.
```

## important implementation bits.

- [MainScriptChecker.tsx](./src/MainScriptChecker.tsx#L23-L55) - performs a hhtp head request on the 'main script', failure case means an update is available.

## pros and cons

- **pro** no service worker complexity, just plain old react.
- **pro** implementation is highly portable (self contained).
- **pro** since the polling code lives in reactland™, its easy to create a pretty widget.
- **con** failure case is dependant on the hosting tech (used to host create react app's static output).
