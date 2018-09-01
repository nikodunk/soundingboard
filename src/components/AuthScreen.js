import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { connect } from 'react-redux';
import { sendPhoneNumber } from '../actions/actions';
import styles from './_styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';


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
    console.log(email)
      AsyncStorage.setItem('email', email )
  };


  render() {
    return (
      <View style={styles.loginContainer}>
      <ImageBackground source={require('../../assets/2.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
      { this.state.loading ? 
        <View style={styles.loginBox}><ActivityIndicator color="black" /></View> 
        : 
        <View style={styles.loginBox}>
          <Animatable.View animation="tada" easing="ease-out">
              <Image style={[styles.buttonImage, {marginLeft: 30}]} source={require('../../assets/logo.png')} />
              <Text style={[styles.title]}>soap dictate</Text>
          </Animatable.View>
          
          <Text> </Text>
          <Text style={styles.subtitle}>Mobile EMR/EHR Note Dictation</Text>
          <Text> </Text>
          <Text> </Text>
          <TextInput 
          underlineColorAndroid="transparent"
          style={styles.input}
          placeholder={'Work email'}
          autoFocus={true}
          autoCapitalize = 'none'
          keyboardType={'email-address'}
          onChangeText={ (text) => {  this.setState({email: text}) }}
          />
          <TouchableOpacity 
            style={styles.materialButtonLong}
            onPress={() => this._onPress(this.state.email)} >
              <Text style={styles.materialButtonTextLong}>
              Continue
              </Text>
          </TouchableOpacity> 
          <Text> </Text>
          <Text style={styles.title}> </Text>
        </View>
      }
      </ImageBackground >
      </View>
      );
  }
}


const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendPhoneNumber: (phone) => dispatch(sendPhoneNumber(phone))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);