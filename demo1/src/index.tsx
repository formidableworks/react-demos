import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import './index.css';
import { store } from './redux/store';
import { swAppUpdaterSlice } from './redux/swAppUpdaterSlice';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <App />
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

// note-worthy bit:
// register a callback which will dispatch an action.
serviceWorkerRegistration.register({
  onUpdate: () => {
    store.dispatch(swAppUpdaterSlice.actions.updateAvailable());
  },
});
// registering a callback via serviceWorkerRegistration.register only
// seems to work reliably in the same file as react's root.render.
// ideally it would be squirelled away within a react hook, without any redux involvement.

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
