import React from 'react';

import ReactDOM, { /*render*/ }  from 'react-dom';
import { BrowserRouter, /*HashRouter, Router,*/ Route, Switch } from "react-router-dom" 
//import './index.css';
import App from './App';
import Evento from './Evento';
import Login from './Login';
import Live from './Live';
import PainelChat from './PainelChat';
// import Painel from './Painel';

import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <BrowserRouter>
     <Switch>

          {/*
            <Route path="/live" component={Live} />
            <Route path="/painel" component={Painel} />
            <Route path="/evento" component={Evento} />
          */}

          <Route path="/:customPath/login" exact component={ Login } />
          <Route path="/:customPath/live" exact component={ Live } />
          <Route path="/:customPath/painelchat" exact component={ PainelChat } />
          <Route path="/:customPath" exact component={ Live } />
          <Route path="/" exact component={ App } />

      </Switch>
  </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
