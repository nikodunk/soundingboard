import React from 'react';
import {  StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          StatusBar, 
          AsyncStorage, 
          ActivityIndicator, 
          FlatList, 
          Linking, 
          Image, 
          ImageBackground,
          TextInput,
          Platform,
          Keyboard} from 'react-native';
import { connect } from 'react-redux';
import { alterUsergroup } from '../actions/actions';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';

class SettingsScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          usergroup: '',
          phoneNo: ''
        };
      }
      
      componentDidMount() {
          AsyncStorage.getItem('usergroup').then((res) => {
              this.setState({usergroup: res});
                  })
          AsyncStorage.getItem('phone').then((res) => {
              this.setState({phoneNo: res}) 
                  })

      }

      _setEmail(){
          console.log(this.state.email)
          Keyboard.dismiss()
          if(this.state.email){
            AsyncStorage.setItem('email', this.state.email)
          }
      }



      render() {
          return (
              <ImageBackground source={require('../../assets/2.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
                <View style={styles.container}>
                  <StatusBar
                     barStyle="dark-content"
                   />
                        <Animatable.View animation="slideInLeft" duration={300} easing="ease-out" style={{marginTop: 30, marginLeft: 10, flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                          <TouchableOpacity
                              onPress={() => this.props.navigation.openDrawer() }
                              activeOpacity={.4}
                              style={styles.hamburgerBar}>
                                  <Image style={styles.hamburger} source={require('../../assets/hamburger.png')} />
                                  <Text style={styles.title}><Text>Settings</Text></Text>
                          </TouchableOpacity>   
                        </Animatable.View> 
                        
                      
                      <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          

                          <Text></Text>
                          
                          <View style={{flexDirection:'row', alignItems: 'center'}}>
                            
                            <TextInput 
                              underlineColorAndroid="transparent"
                              style={styles.input}
                              placeholder={'zoidberg@hospital.com'}
                              autoCorrect={false}
                              autoCapitalize={'none'}
                              onChangeText={(text) => {  this.setState({'email': text}) }} 
                            />

                            <TouchableOpacity style={[{marginLeft: 5, maxWidth: 100}]} 
                                              onPress={() => this._setEmail()} >
                              <Text 
                                style={styles.outlineButton}>
                                Set
                              </Text>
                            </TouchableOpacity>

                          </View>
                          <Text></Text>
                          <Text>Address that will auto-fill when emailing note</Text>
                          <View style={styles.separator} />
                          
                          <Text></Text>
                          <Text></Text>
                          <View style={styles.separator} />
                          <Text></Text>
                          <Text></Text>
                          
                          
                          <TouchableOpacity onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} >
                            <Text style={[styles.outlineButton]}>
                              Send Feedback
                            </Text>
                          </TouchableOpacity> 
                          <Text></Text>
                          <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>

                          <Text></Text>
                          <Text></Text>
                          <View style={styles.separator} />
                          <Text></Text>
                          <Text></Text>


                          <TouchableOpacity 
                              style={[styles.materialButtonLong]} 
                              onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/app/id1384252497') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.pokedoc.iamoff')} >
                            <Text style={[styles.materialButtonTextLong]}>
                              Invite Friends
                            </Text>
                          </TouchableOpacity> 

                      </View>  
                            
                </View> 
                

              
            </ImageBackground>

        
          );
        }
        

    }

const mapStateToProps = (state) => {
    return {
        items: state.items,
        user: state.user,
        token: state.token,
        loggedIn: state.loggedIn,
        firstrun: state.firstrun
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        alterUsergroup: (phone, usergroup) => dispatch(alterUsergroup(phone, usergroup))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);