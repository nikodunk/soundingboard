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
        this.state = { loading: false };
      }


      _onPress = async (phone) => {
        this.setState({loading: true})
        console.log(phone)
        await this.props.sendPhoneNumber(phone).then((res) => {
              console.log(res)
              if (res === phone +' exists') { AsyncStorage.setItem('phone', phone ).then(() => this.props.navigation.navigate('LoginScreen')) }
              else{ AsyncStorage.setItem('phone', phone ).then(() => this.props.navigation.navigate('RegisterScreen')) }
            });
        
      };


      render() {
          return (
            <View style={styles.loginContainer}>
              <ImageBackground source={require('../../assets/1.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
                  {this.state.loading ? 
                    <View style={styles.loginBox}><ActivityIndicator color="black" /></View> : 
                    <View style={styles.loginBox}>
                      <Animatable.View animation="bounceIn" easing="ease-out">
                          <Text style={styles.title}>simple</Text>
                          <Text style={styles.title}>soap</Text>
                      </Animatable.View>
                      <Text> </Text>
                      <Text style={styles.subtitle}>Mobile EMR/EHR Note Dictation</Text>
                      <Text> </Text>
                      <Text> </Text>
                      <TextInput 
                        underlineColorAndroid="transparent"
                        style={styles.input}
                        placeholder={'Phone Number'}
                        autoFocus={true}
                        keyboardType={'numeric'}
                        onChangeText={ (text) => {  text.length === 10 ? this._onPress(text) : null }}
                        />
                      <Text style={styles.label}>Both for Login and Signup</Text>
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