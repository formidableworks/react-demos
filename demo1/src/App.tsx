import React from 'react';
import './App.css';
import logo from './logo.svg';
import { SnackbarDeployer } from './swUpdateTest/SnackbarDeployer';

export function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Service Worker Updater 1</h2>
        <SnackbarDeployer />
      </header>
    </div>
  );
}
