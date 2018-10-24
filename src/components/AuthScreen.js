import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

import * as RNIap from 'react-native-iap';


import Button from 'react-native-button';



const itemSkus = Platform.select({
  ios: [
    'com.bigset.monthly'
  ],
  // android: [
  //   'com.example.coins100'
  // ]
});




class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
        loading: false,
        email: ''
       };
  }




  _onPress = async (email) => {
    this.setState({loading: true})
    fetch('https://healthnotes.herokuapp.com/email/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
    })
    .then(() => AsyncStorage.setItem('email', email ))
    .then(() => { this._buyProduct() })
  };


  _buyProduct(){
        
      RNIap.buyProduct('com.bigset.monthly').then(purchase => {
        

        AsyncStorage.setItem('receipt', purchase.transactionReceipt )
        // console.log('SUCCESS!! ', purchase)
        this.props.navigation.navigate('SignedInRouter')

      }).catch(err => {
        
        this.setState({loading: false})

        console.warn(err); // standardized err.code and err.message available
        
        alert(err.message);

        
      })
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ textAlign: 'center', alignItems: 'center', flex: 0.6}}>
      
          <Animatable.View animation="fadeIn" easing="ease-out">
              <Text style={{fontSize: 26, marginTop: 30, color: '#2191fb'}}>Dictate Your Charting</Text>
          </Animatable.View>
          <Text style={{fontSize: 18, textAlign: 'center', margin: 6, }}>
              Save 20 hours of typing a month for $1.99/mo.
          </Text>
          
          
          { this.state.loading ? 
            
            <ActivityIndicator style={{marginTop: 10}} color="black" />
            
            : 
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 15, textAlign: 'center', color: 'grey'}}>
                  Type your email to start 1-week free trial.
              </Text>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TextInput 
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    placeholder={'Work email'}
                    autoFocus={true}
                    autoCapitalize = 'none'
                    keyboardType={'email-address'}
                    onChangeText={ (text) => {  this.setState({email: text}) }}
                />
              </View>
              <Button 
                style={styles.bottomButton}
                onPress={() => this._onPress(this.state.email)} >
                Start free trial, then $1.99/month
              </Button> 
              <Text style={{fontSize: 12, textAlign: 'center', color: 'lightgrey'}}>
                  By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.
              </Text>
            </View>
          }
      
        </View>
      </View>
      );
  }
}

styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  input:{
        height: 40, 
        width: 200,
        borderColor: 'gray', 
        borderWidth: 1,
        marginTop: 10,
        borderRadius:5,
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
  bottomButton:{
    color: 'white',
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#2191fb', 
    borderWidth: 0,
    borderRadius: 10,
    overflow:'hidden',
    fontSize: 18,
    fontWeight: '600'
  },
  bottomButtonDisabled:{
    color: 'white',
    padding: 15,
    margin: '4%',
    backgroundColor: 'lightgray', 
    width: '92%',
    borderWidth: 0,
    borderRadius: 10,
    overflow:'hidden',
    fontSize: 18,
    fontWeight: '600'
  }
})


export default AuthScreen;