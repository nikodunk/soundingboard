import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator, NativeModules, Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';

import DictationScreen from './DictationScreen'
import SettingsScreen from './SettingsScreen'
import SideMenu from './SideMenu';
import AuthScreen from './AuthScreen';

import styles from './_styles'

import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'com.bigset.monthly'
  ],
  // android: [
  //   'com.example.coins100'
  // ]
});



SignedInRouter = createSwitchNavigator({
		DictationScreen: { screen: DictationScreen },
    Settings: { screen: SettingsScreen }
	},
	{ 
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} /> ),
  }
)

const SignedOutRouter = createStackNavigator({
  AuthScreen: { screen: AuthScreen, navigationOptions: {title: 'Welcome', header: null} },
  // LoginScreen: { screen: LoginScreen, navigationOptions:{ title: 'Sign Up', header: null} },
  // RegisterScreen: { screen: RegisterScreen, navigationOptions:{ title: 'Sign Up', header: null} }
  });




class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }


  // CHECK IF WE HAVE ANY AVAILABLE PURCHASES
  async _getProducts() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({ products });
      console.log( products )
      
      this._validatePurchase()

    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }


  _validatePurchase = async() => {
    AsyncStorage.getItem('receipt').then((receipt) =>{
        // console.log(receipt)
        const receiptBody = {
          'receipt-data': receipt,
          'password': '427e85d574e34185a6263a63eb2f6c20'
        };
        RNIap.validateReceiptIos(receiptBody, false).then((result) => {
            console.log(result);
            this.props.navigation.navigate(result.status == 0 ? 'SignedInRouter' : 'Auth');
        })
        
    })
    
  }


  componentWillUnmount() {
    RNIap.endConnection();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('email');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken && ? 'SignedInRouter' : 'Auth');

    this._getProducts()
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



