import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';

import DictationScreen from './DictationScreen'
import AuthScreen from './AuthScreen'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import SideMenu from './SideMenu';

import styles from './_styles'



SignedInRouter = createDrawerNavigator({
		DictationScreen: { screen: DictationScreen },
	},
	{ 
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} /> ),
  }
)



const SignedOutRouter = createStackNavigator({
  AuthScreen: { screen: AuthScreen, navigationOptions: {title: 'Welcome', header: null} },
  LoginScreen: { screen: LoginScreen, navigationOptions:{ title: 'Sign Up', header: null} },
  RegisterScreen: { screen: RegisterScreen, navigationOptions:{ title: 'Sign Up', header: null} }
  });



class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('jwt');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'SignedInRouter' : 'Auth');
  };
  render() {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator />
      </View>
    );
  }
}




export default Router = createSwitchNavigator(
  {
    SignedInRouter: SignedInRouter,
    AuthLoading: AuthLoadingScreen,
    Auth: SignedOutRouter,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);




