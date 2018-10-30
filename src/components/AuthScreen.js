import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image, Platform, ScrollView, KeyboardAvoidingView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');


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

  componentDidMount() {
      Mixpanel.track("Authscreen Loaded");
      // AsyncStorage.getItem('email').then((res) => {
      //   email = res
      //   this.setState({email: email})
      // })
  }



  _onPress = async (email) => {
    Mixpanel.track("Subscribe Pressed");
    this.setState({loading: true})
    console.log(email)
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
        <View style={{ textAlign: 'center', alignItems: 'center', flex: .7}}>
      
          <Animatable.View animation="fadeIn" duration={1000}>
            <Text style={{fontSize: 24, marginTop: 30, color: '#2191fb', textAlign: 'center'}}>
                Save an hour of note-typing every day.
            </Text>

          </Animatable.View>
          <Animatable.View animation="fadeIn"  duration={3000}>
            <Text style={{fontSize: 16, textAlign: 'center' }}>
                Agree to terms, enter email, and start 1-week free trial. $3.99/month after that.
            </Text>
          </Animatable.View>
          
          { this.state.loading ? 
            
            <ActivityIndicator style={{marginTop: 10}} color="black" />
            
            : 
            <KeyboardAvoidingView behavior="padding" enabled>
              <ScrollView style={{ margin: 5, borderWidth: 1, borderColor: 'lightgrey', padding: 5}}>
                            <Text style={{fontSize: 12, color: 'grey'}}>
                                • Payment will be charged to iTunes Account at confirmation of purchase {'\n'}
                                • Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period {'\n'}
                                • Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal{'\n'}
                                • Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase{'\n'}
                                • Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable{'\n'}
                                • By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.{'\n'}
                            </Text>
                            <Text style={{fontSize: 12, color: '#2191fb'}}
                                  onPress={() => Linking.openURL('http://soapdictate.com/terms/')}>
                              • Terms of Service{'\n'}
                            </Text>
                            <Text style={{fontSize: 12, color: '#2191fb'}}
                                  onPress={() => Linking.openURL('http://soapdictate.com/privacy/')}>
                              • Privacy Policy{'\n'}
                            </Text>
              </ScrollView>
              <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#2191fb', overflow: 'hidden', margin: 5, marginTop: 0}}>
                <TextInput 
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    placeholder={'Enter email'}
                    autoFocus={false}
                    autoCapitalize = 'none'
                    keyboardType={'email-address'}
                    onChangeText={ (text) => {  this.setState({email: text}) }}
                />
                <Button 
                  style={styles.bottomButton}
                  onPress={() => this._onPress(this.state.email)} >
                  Start free trial, then $3.99/month
                </Button>
              </View>
            </KeyboardAvoidingView>
          }
      
        </View>
      </View>
      );
  }
}

styles = StyleSheet.create({
  container: {
        backgroundColor: 'white',
        flex: 1,
  },
  input:{
        height: 40, 
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
  bottomButton:{
        color: 'white',
        padding: 15,
        backgroundColor: '#2191fb', 
        borderWidth: 0,
        overflow:'hidden',
        fontSize: 18,
        fontWeight: '600',
        height: 50, 
  }
})


export default AuthScreen;