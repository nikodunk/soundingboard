import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';

import DictationScreen from './DictationScreen'
import SettingsScreen from './SettingsScreen'
import SideMenu from './SideMenu';

import styles from './_styles'



SignedInRouter = createDrawerNavigator({
		DictationScreen: { screen: DictationScreen },
    Settings: { screen: SettingsScreen }
	},
	{ 
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} /> ),
  }
)

// const SignedOutRouter = createStackNavigator({
//   AuthScreen: { screen: AuthScreen, navigationOptions: {title: 'Welcome', header: null} },
//   LoginScreen: { screen: LoginScreen, navigationOptions:{ title: 'Sign Up', header: null} },
//   RegisterScreen: { screen: RegisterScreen, navigationOptions:{ title: 'Sign Up', header: null} }
//   });





export default Router = createSwitchNavigator(
  {
    SignedInRouter: SignedInRouter
  },
  {
    initialRouteName: 'SignedInRouter'
  }
);




