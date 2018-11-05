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
          Button,
          ScrollView} from 'react-native';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';


var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');



class SettingsScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          usergroup: '',
          email: '',
          subscribed: false
        };
      }
      
      componentDidMount() {
          AsyncStorage.getItem('email').then((res) => {
            this.setState({email: res})
          })

          AsyncStorage.getItem('subscribed').then((res) => {
            this.setState({subscribed: res})
          })

          Mixpanel.track("Settings Loaded");
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
                        
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
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
                        
                        
                    <ScrollView>
                      
                          
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
                        </View>
                          
                          
                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>
                          
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <TouchableOpacity onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} >
                            <Text style={[styles.outlineButton]}>
                              Send Feedback
                            </Text>
                          </TouchableOpacity> 
                          <Text></Text>
                          <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>
                        </View>


                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                          
                        </View>
                        

                        
                        {this.state.subscribed ?
                          <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                            <Text style={{fontSize: 15, textAlign: 'center', color: 'grey'}}>
                              You are currently enrolled in the $3.99/mo plan. Cancel your subscription any time in the iOS "Settings" App under "iTunes & App Store" > "Apple ID" > "View Apple ID" > "Subscriptions".
                            </Text>
                            <View>
                              <Text></Text>
                              <View style={styles.separator} />
                            </View>
                          </View>

                          :
                          null
                        }


                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <TouchableOpacity 
                              style={[styles.materialButtonLong]} 
                              onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/app/id1384252497') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.pokedoc.iamoff')} >
                            <Text style={[styles.materialButtonTextLong]}>
                              Invite Friends
                            </Text>
                          </TouchableOpacity> 
                        </View>


                       
                    </ScrollView>
                            
                </Animatable.View> 
                

              
            

        
          );
        }
        

    }



export default SettingsScreen;