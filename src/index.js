import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import {Provider} from 'react-redux';
import configureStore from "./store";
import { PersistGate } from "redux-persist/lib/integration/react";

const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
  ,document.getElementById('root')
);
