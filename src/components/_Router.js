import {React, Component} from 'react';
import { ScrollView,  StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { StackNavigator, SwitchNavigator, DrawerNavigator, DrawerView, DrawerItems } from 'react-navigation';
// import { connect } from 'react-redux';
// import { getToken } from '../actions/actions';

import DictationScreen from './DictationScreen'
import styles from './_styles'
import SideMenu from './SideMenu';



const SignedInRouter = DrawerNavigator(
	{
		Nicholas: {
		    screen: DictationScreen
		  },
	},
	{
		contentComponent: SideMenu
	}
)




export default Router = SwitchNavigator(
  {
    SignedInRouter: SignedInRouter,
  },
  {
    initialRouteName: 'SignedInRouter',
  }
);


