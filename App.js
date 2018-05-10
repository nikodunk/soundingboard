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

import DictationScreen from './src/DictationScreen';

export default class App extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <DictationScreen />
      </View>
    );
  }
}
