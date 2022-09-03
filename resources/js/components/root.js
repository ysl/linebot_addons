import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Modal from 'react-modal';
import Liff from './liff/index';

Modal.setAppElement('#my-modal')

function Root() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Liff} />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('app')
);
