import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, TextInput, TouchableOpacity,Picker, ImageBackground, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { register } from '../actions/actions';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';




class RegisterScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { loading: false,
      phoneNo: '',
      PIN: '' }
    }

    componentDidMount() {
      AsyncStorage.getItem('phone').then((res) => this.setState({phoneNo: res}))
    }


    register = async () => {
      this.setState({loading: true})
          // console.log('this.state.phoneNo:', this.state.phoneNo)
          this.props.register(this.state.phoneNo, this.state.PIN, this.state.name, this.state.usergroup )
          .then(() => this.props.navigation.navigate('AuthLoading'))
        }
        
        
        


        render() {
          return (
            <View style={styles.loginContainer }>
            <ImageBackground source={require('../../assets/1.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
            <View style={styles.loginBox}>


            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex:.3}}>
            <Text>Set PIN</Text>
            </View>
            <View style={{flex:.7}}>
            <TextInput 
            underlineColorAndroid="transparent"
            style={styles.input}
            placeholder={'8523'}
            keyboardType={'numeric'}
            maxLength = {4}
            onChangeText={(text) => {  this.setState({'PIN': text}) }} />
            </View>
            </View>
            
            

            <TouchableOpacity 
            style={styles.materialButtonLong}
            onPress={() => this.register()} >
            <Text style={styles.materialButtonTextLong}>
            Finalize
            </Text>
            </TouchableOpacity> 
            
            
            
            
            
            
            
            
            {this.state.loading ? <ActivityIndicator /> : null}
            </View>
            </ImageBackground>
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
            register: (PIN, phone, name, usergroup) => dispatch(register(PIN, phone, name, usergroup))
          };
        };



        export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);