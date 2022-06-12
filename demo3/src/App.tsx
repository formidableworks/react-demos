import React from 'react';
import './App.css';
import logo from './logo.svg';
import { MainScriptChecker } from './MainScriptChecker';

export function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Script Hash Checker</h2>
        <br />
        <MainScriptChecker intervalTime={5000} numberOfSegments={8} />
      </header>
    </div>
  );
}
