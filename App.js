import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import './src/components/_Router'

import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import combinedReducers from './src/reducers';
import thunk from 'redux-thunk';

const store = createStore(combinedReducers, applyMiddleware(thunk));



export default class App extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <Provider store={store}>
          <Router />
        </Provider>
      </View>
    );
  }
}
