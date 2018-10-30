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
          Keyboard,
          Button} from 'react-native';
import { connect } from 'react-redux';
import { alterUsergroup } from '../actions/actions';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';

class SettingsScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          usergroup: '',
          email: ''
        };
      }
      
      componentDidMount() {
          AsyncStorage.getItem('email').then((res) => {
            this.setState({email: res})
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
              
                <Animatable.View animation="slideInLeft" duration={400} easing="ease-out" style={{flex: 1, alignItems: 'center',}}>
                  <StatusBar
                     barStyle="dark-content"
                   />
                        
                  <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', width: '100%'}}>
                    <Button
                      onPress={() => this.props.navigation.navigate('DictationScreen')}
                      title={"Back"}
                      ></Button>
                    <Text style={{padding: 8, fontSize: 20}}>Settings   </Text>
                    <Button
                      onPress={() => {}}
                      title={"    "}
                      ></Button>
                  </View>   
                        
                        
                      
                      <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}>
                            
                            <TextInput 
                              underlineColorAndroid="transparent"
                              style={styles.input}
                              placeholder={this.state.email}
                              autoCorrect={false}
                              keyboardType={'email-address'}
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
                          <View style={styles.separator} />
                          <Text></Text>
                          
                          
                          <TouchableOpacity onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} >
                            <Text style={[styles.outlineButton]}>
                              Send Feedback
                            </Text>
                          </TouchableOpacity> 
                          <Text></Text>
                          <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>

                          <Text></Text>
                          <View style={styles.separator} />
                          <Text></Text>

                          <Text></Text>
                          <Text style={{fontSize: 15, textAlign: 'center', color: 'grey'}}>
                              You are currently enrolled in the $1.99/mo plan. Cancel your subscription any time in the iOS "Settings" App under "Subscriptions".
                          </Text>
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
                            
                </Animatable.View> 
                

              
            

        
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