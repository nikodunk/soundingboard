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
          ScrollView,
          Picker} from 'react-native';
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
          subscribed: false,
          language: null,
          fontSize: null,
        };
      }
      
      componentDidMount() {
          AsyncStorage.getItem('email').then((res) => {
            this.setState({email: res})
          })

          AsyncStorage.getItem('subscribed').then((res) => {
            this.setState({subscribed: res})
          })

          AsyncStorage.getItem('fontSize').then((res) => {
            this.setState({fontSize: res.toString()})
          })

          AsyncStorage.getItem('language').then((res) => {
            this.setState({language: res})
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

      _onChangeFontSize(newFontSize){
        AsyncStorage.setItem('fontSize', newFontSize.toString())
        this.setState({fontSize: newFontSize})
      }


      _onChangeLanguage(newLanguage){
        AsyncStorage.setItem('language', newLanguage)
        this.setState({language: newLanguage})
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

                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>

                        
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}> 

                            <Text>Font size of dictated text </Text>
                            <Picker
                              selectedValue={this.state.fontSize}
                              itemStyle={{height: 44}}
                              style={{ height: 50, width: 100, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10, margin: 10 }}
                              onValueChange={(itemValue, itemIndex) => this._onChangeFontSize(itemValue)}>
                              <Picker.Item label="10" value="10" />
                              <Picker.Item label="12" value="12" />
                              <Picker.Item label="14" value="14" />
                              <Picker.Item label="16" value="16" />
                              <Picker.Item label="18" value="18" />
                              <Picker.Item label="20" value="20" />
                              <Picker.Item label="22" value="22" />
                              <Picker.Item label="24" value="24" />
                              <Picker.Item label="26" value="26" />
                              <Picker.Item label="28" value="28" />
                              <Picker.Item label="30" value="30" />
                            </Picker>

                          </View>
                        </View>


                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>


                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'column', alignItems: 'center'}}> 

                            <Text>Language for recognition</Text>
                            <Picker
                              selectedValue={this.state.language}
                              itemStyle={{height: 50}}
                              style={{ height: 56, width: 200, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10, margin: 10 }}
                              onValueChange={(itemValue, itemIndex) => this._onChangeLanguage(itemValue)}>
                              <Picker.Item label="U.S. English" value="en" />
                              <Picker.Item label="UK English" value="en-GB" />
                              <Picker.Item label="English (Indian)" value="en-IN" />
                              <Picker.Item label="Chinese (Simplified)" value="zh-Hans" />
                              <Picker.Item label="Chinese (Traditional)" value="zh-Hant" />
                              <Picker.Item label="Chinese (Hong Kong)" value="zh-HK" />
                              <Picker.Item label="German" value="de-DE" />
                              <Picker.Item label="Spanish" value="es" />
                              <Picker.Item label="Spanish (Mexico)" value="es-MX" />
                            </Picker>

                          </View>
                        </View>

                       
                    </ScrollView>
                            
                </Animatable.View> 
                

              
            

        
          );
        }
        

    }



export default SettingsScreen;