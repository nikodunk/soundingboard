import {React, Component} from 'react';
import { ScrollView,  StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { SwitchNavigator, DrawerNavigator } from 'react-navigation';

import DictationScreen from './DictationScreen'
import styles from './_styles'
import SideMenu from './SideMenu';



const SignedInRouter = DrawerNavigator(
	{
		DictationScreen: {
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


