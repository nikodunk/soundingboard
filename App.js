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
import SwitchNavigator from './src/components/_Router'




export default class App extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <Router />
      </View>
    );
  }
}
