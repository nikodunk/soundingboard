import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  AsyncStorage,
  Linking,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Vibration,
  ScrollView,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity
} from 'react-native';
import Button from 'react-native-button';

import * as Animatable from 'react-native-animatable';
import FontAwesome, { Icons } from 'react-native-fontawesome';



import Voice from 'react-native-voice';

import Sound from 'react-native-sound';
Sound.setCategory('MultiRoute');
var blip = new Sound('blip.m4a', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');



import * as RNIap from 'react-native-iap';
const itemSkus = Platform.select({
  ios: [
    'com.bigset.monthly'
  ],
  // android: [
  //   'com.example.coins100'
  // ]
});


export default class VoiceNative extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        recognized: '',
        started: '',
        results: [],
        recording: false,
        editing: false,
        previousNote: null,
        noInput: false,
        stopping: false,
        unlocked: false,
        loading: true,
        subscribed: false,
        remaining: 5, //for view purposes only!!!
        fontSize: 15,
        language: 'en-US'
      };

      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  componentDidMount() {
      // AsyncStorage.removeItem('remainingtrials')
      // AsyncStorage.removeItem('email')

      Mixpanel.track("DictationScreen Loaded");

      // check if subscribed and save for settings screen
      this._getProducts()

      // get notes
      AsyncStorage.getItem('notes').then((notes) => {
                if(notes === ''){
                    this.setState({ 'storedNote': '' })
                  }
                else{
                    this.setState({ 'storedNote': JSON.parse(notes) }) 
                  }
            })

      // get email
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
      })

      AsyncStorage.getItem('fontSize').then((res) => {
        this.setState({fontSize: parseInt(res)})
      })


      AsyncStorage.getItem('language').then((res) => {
        this.setState({language: res})
      })

  }


  componentWillUnmount() {
      Voice.destroy().then(Voice.removeAllListeners);
    }


  onSpeechStart(e) {
      this.setState({
        started: '√',
      });
    };

  onSpeechRecognized(e) {
      this.setState({
        recognized: '√',
      });
    };

  onSpeechResults(e) {
      this.setState({
        results: e.value,
      });
    }


  // CHECK IF WE HAVE ANY AVAILABLE PURCHASES
  async _getProducts() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({ products });
      console.log( products )
      
      // CHECK if already subscribed on AuthScreen and saved to var "receipt" in Asyncstorage
      AsyncStorage.getItem('receipt').then((receipt) => {
          // console.log(receipt)
          const receiptBody = {
            'receipt-data': receipt,
            'password': '427e85d574e34185a6263a63eb2f6c20'
          };

          // CHECK whether there's a subscription, and unlock if there is
          RNIap.validateReceiptIos(receiptBody, false).then((result) => {
              console.log(result);
              if(result.status == 0 || result.status == 21007){ 
                  this.setState({unlocked: true})
                  this.setState({loading: false})
                  this.setState({subscribed: true})
                  AsyncStorage.setItem('subscribed', 'true')
                }
              else{ 
                  this._checkTrial() 
                  this.setState({loading: false})
                }
              
          })
      })

    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }



  // CHECK IF STILL IN TRIAL
  _checkTrial(){
      AsyncStorage.getItem('remainingtrials').then((remainingtrials) => {
          console.log(remainingtrials)
          if(remainingtrials === null ){
            console.log('first trial dictation!')
            AsyncStorage.setItem('remainingtrials', '5')
            this.setState({ unlocked: true, remaining: remainingtrials })
            console.log(this.state.unlocked)
          }
          else if( 0 < remainingtrials && remainingtrials < 6 ){
            console.log('trials remaining')
            this.setState({ unlocked: true, remaining: remainingtrials })
            console.log(this.state.unlocked)
          }
          else{
            console.log('NO trials remaining')
            this.setState({ unlocked: false, remaining: remainingtrials })
            console.log(this.state.unlocked)
          }
      })
  }

  

  // RECOGNITION METHODS
  // -----------------------------------------------------------------------------------------------------------------------


  // MASTER TOGGLE RECOGNITION
  _toggleRecognizing(e) {
      if (this.state.recording === false) { 
        
        blip.play();
        // Vibration.vibrate()

        this._startRecognition(e);
        this.setState({continuing: true})
        

        setInterval(() => { 
            if (this.state.recording === true){

                this._stopRecognition(e)
                // console.log('continuing')
                
              }
         }, 55000);
       }
      else{
        this._stopRecognition(e)
        this.setState({continuing: false})
        blip.play();
        Vibration.vibrate()
        
       }
    }



  // START RECOGNITION
  async _startRecognition(e) {
      console.log('starting')
      Mixpanel.track("Recognition Started");
      this.setState({previousNote: this.state.storedNote})

      this.setState({
        recognized: '',
        started: '',
        results: [],
        recording: true
      });
      try {
        await Voice.start(this.state.language);
      } catch (e) {
        console.error(e);
      }
    }







  // STOP RECOGNITION
  async _stopRecognition(e) {
      try {
        await Voice.stop();
        if(this.state.continuing && this.state.results[0] === undefined){
          // CASE UNDEFINED BUT CONTINUING
          
          Mixpanel.track("Recognition Continuing as undefined");
          console.log('onspeechcontinue as undefined')
          setTimeout(() => { Voice.start(this.state.language) }, 500);

          // if this.state.continuing and DEFINED: see onSpeechEnd does the rest
          }
      } catch (e) {
        console.error(e);
      }

      

      // ONLY IF NOT CONTINUING AKA REALLY STOPPING
      if(!this.state.continuing){
            console.log("stopping. not continuing.")
            this.setState({stopping: true})

            // CASE UNDEFINED
            if (this.state.results[0] === undefined){
                this.setState({noInput: true, recording: false, stopping: false})
                setTimeout(() => { 
                    this.setState({noInput: false})
                  }, 10000);
              }
            
            // REMOVE REMAINING TRIALS
            if(!this.state.subscribed){
              AsyncStorage.getItem('remainingtrials').then((res) => {
                var newRemainingTrials = res - 1
                AsyncStorage.setItem('remainingtrials', newRemainingTrials.toString() )
                this._checkTrial()
              })
            }
      }
      
    }





  // ON FINAL RESULTS ARE IN – EVENT CALLED ONLY IF THERE ARE RESULTS AND WHEN FINAL RESULTS ARE IN BACK FROM SERVER – CAN BE DELAYED AFTER STOP, DEPENDING ON CONNECTION SPEED
  onSpeechEnd(e) {
      

          Mixpanel.track("Recognition Successfully Ended");
          var newNote
          // CONCATENATE TO OLD NOTE IF THERE WAS AN EXISTING NOTE, OTHERWISE NEW NOTE
          this.state.storedNote ? newNote = this.state.storedNote + ' ' + this.state.results[0] : newNote = this.state.results[0] 

          // SAVE TO STATE AND TO DISK
          AsyncStorage.setItem('notes', JSON.stringify(newNote))
          this.setState({ 'storedNote': newNote });
          

          this.setState({
            results: [],
            recording: false,
            stopping: false
          });
          

      if(!this.state.continuing){ console.log('onspeechend')}

      
      if(this.state.continuing){ this._startRecognition(e); console.log('onspeechcontinue') }

    }

  
  // OTHER METHODS
  // -----------------------------------------------------------------------------------------------------------------------

  email(){
    Mixpanel.track("Email Pressed");
    AsyncStorage.getItem('email').then((email) => {
      // tracker.trackEvent("buttonexport", "exported email");
      Platform.OS === 'ios'
        ? Linking.openURL('mailto:'+email+' ?cc=&subject=Export from Soapdictate &body='+ this.state.storedNote) 
        : Linking.openURL('mailto:'+email+' ?cc=&subject=yourSubject&body=yourMessage')
    })
  }

  delete(){
    Mixpanel.track("Delete Pressed");
    this.setState({previousNote: this.state.storedNote})
    AsyncStorage.removeItem('notes')
    this.setState({storedNote: ''})
  }

  undo(){
    Mixpanel.track("Undo Pressed");
    if (this.state.previousNote !== null ){ 
        AsyncStorage.setItem('notes', JSON.stringify(this.state.previousNote)); 
        destroyedNote = this.state.storedNote
        this.setState({storedNote: this.state.previousNote})
        this.setState({previousNote: destroyedNote})
       }
    else return
  }

  copy(){
    Mixpanel.track("Copy Pressed");
    Clipboard.setString(this.state.storedNote);
  }

  _toggleEditing(){
    Mixpanel.track("Edit Pressed");
    if (this.state.editing === true){

      // STOP EDITING AND SAVE
      this.setState({editing: false})
      AsyncStorage.setItem('notes', JSON.stringify(this.state.editedText))
      this.setState({storedNote: this.state.editedText})
    }
    if (this.state.editing === false){

      // START EDITING
      this.setState({editing: true})
      this.setState({editedText: this.state.storedNote})
    }
    else return
    
  }

  

  // VIEW
  // -----------------------------------------------------------------------------------------------------------------------


  render () {
      return (

        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            
            <View style={styles.topBar}>
                  <Button
                    style={ styles.button }
                    disabled={this.state.recording || this.state.editing }
                    onPress={() => this.props.navigation.navigate('Settings')}
                    >Settings</Button>


                  {!this.state.editing ? 
                    <Button
                      style={ styles.button }
                      disabled={this.state.recording || !this.state.storedNote}
                      onPress={this._toggleEditing.bind(this)}
                      >Edit</Button>
                    :
                    <Button
                      style={ styles.button }
                      onPress={this._toggleEditing.bind(this)}
                      >Done</Button>
                  }
            </View>

            <View style={styles.transcript}>


                  { this.state.editing ? 
                    <TextInput
                             style={styles.textInput}
                             multiline = {true}
                             autoFocus = {true}
                             onChangeText={(text) => this.setState({editedText: text})}
                             value={this.state.editedText}
                    />
                    :
                    <ScrollView>
                      <Text style={{textAlign: 'center', padding: 8, fontSize: this.state.fontSize}}>
                        {this.state.storedNote}
                        {'\u00A0'}
                        {this.state.recording ? this.state.results[0] : null }
                        {this.state.storedNote || this.state.results[0] ? null : <Text style={{color: 'grey'}}> {'\n'} Press "Start Dictation" below and speak your note. {'\n'}{'\n'}Special commands:{'\n'}"Period"{'\n'}"Questionmark"{'\n'}"Semicolon"{'\n'}"New Line"</Text>}
                        {this.state.recording && !this.state.results[0] && !this.state.continuing ? <Text style={{color: 'red'}}>{'\n'}{'\n'}Go ahead! I'm listening</Text> : null}
                      </Text>
                    </ScrollView> 
                  }


                  { this.state.noInput ? 
                    <Text style={{color: 'red', textAlign: 'center', padding: 5}}>
                      No Voice input detected! Please speak louder, get better WiFi, or give your connection more time.
                    </Text> 
                    :
                    null
                  }

                  


            </View>
            
            {this.state.loading ? <ActivityIndicator style={{marginBottom: 30}} color="black" /> : 
              <View>
                
                

                { this.state.storedNote && !this.state.editing ?
                      <Animatable.View animation="slideInUp" duration={400} easing="ease-out">
                        <View style={styles.optionBar}>
                            
                            <TouchableOpacity 
                              style={[{ borderColor: 'salmon'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.delete.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'salmon'}]}>
                                <FontAwesome>{Icons.trash} </FontAwesome>{'\n'}
                                Delete
                              </Text>
                            </TouchableOpacity>

                            
                            <TouchableOpacity 
                              style={[{ borderColor: '#2191fb'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.undo.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : '#2191fb'}]}>
                                <FontAwesome>{Icons.undo} </FontAwesome>{'\n'}
                                Undo
                              </Text>
                            </TouchableOpacity>



                            <TouchableOpacity 
                              style={[{ borderColor: '#2191fb'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.copy.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : '#2191fb'}]}>
                                <FontAwesome>{Icons.clone} </FontAwesome>{'\n'}
                                Copy
                              </Text>
                            </TouchableOpacity>


                            
                            <TouchableOpacity 
                              style={[{ borderColor: '#2191fb'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.email.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : '#2191fb'}]}>
                                <FontAwesome>{Icons.envelope} </FontAwesome>{'\n'}
                                Email
                              </Text>
                            </TouchableOpacity>


                        </View>
                      </Animatable.View>
                      :
                      null 
                }
                
                { !this.state.subscribed ? 
                  <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                    <Text style={{color: '#2191fb', textAlign: 'center', paddingBottom: 5}}>
                      Remaining dictations before signup: {this.state.remaining ? this.state.remaining : 5}
                    </Text> 
                  </Animatable.View>
                  :
                  null
                }

                {!this.state.editing ?
                      <Animatable.View animation="slideInUp" duration={400} easing="ease-out">
                        
                        <TouchableOpacity 
                          style={[{backgroundColor: this.state.recording ? 'red' : '#2191fb' },
                                  this.state.stopping || !this.state.unlocked ? styles.bottomButtonDisabled : styles.bottomButton]}
                          onPress={this._toggleRecognizing.bind(this)}
                          onLongPress={this._toggleRecognizing.bind(this)}
                          disabled={this.state.stopping || !this.state.unlocked }>
                          <Text
                            style={{color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
                            <FontAwesome>{Icons.microphone} </FontAwesome>
                            {this.state.recording === false ? "Start Dictation" : "Recording... Touch to Stop."}
                          </Text>
                        </TouchableOpacity>

                      </Animatable.View>
                      : null
                }


                {!this.state.unlocked ? 

                    <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                      <TouchableOpacity 
                        style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                        onPress={() => this.props.navigation.navigate('AuthScreen')}>
                        <Text
                          style={{color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
                          Start 7-day free trial to continue
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>

                : 
                null
                }
              </View>
            }
            
          
        </KeyboardAvoidingView>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    topBar:{
      flexDirection: 'row', 
      justifyContent: 'space-between'
    },
    transcript: {
      flex: 1,
    },
    button:{
      padding: 8, 
      fontSize: 18, 
      fontWeight: '400',
      textAlign: 'center'
    },
    textInput:{
      flex: 1,
      borderColor: 'gray', 
      borderWidth: 1, 
      borderRadius: 5, 
      padding: 5, 
      margin: 5,
      fontSize: 20,
      backgroundColor: 'white'
      },
    optionBar:{
      flexDirection: 'row', 
      justifyContent: 'space-around',
      marginBottom: 3,
      marginTop: 3,
      marginLeft: '3%',
      marginRight: '3%'
    },
    bottomButton:{
      padding: 15,
      margin: '4%',
      marginTop: 0,
      width: '92%',
      borderWidth: 0,
      borderRadius: 10,
      overflow:'hidden',
    },
    bottomButtonDisabled:{
      padding: 15,
      margin: '4%',
      backgroundColor: 'lightgrey', 
      width: '92%',
      borderWidth: 0,
      borderRadius: 10,
      overflow:'hidden',
    },
    border:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
    },
    borderDisabled:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
      borderColor: 'lightgrey'
    }
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);