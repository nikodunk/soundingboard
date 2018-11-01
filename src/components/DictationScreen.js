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
  Clipboard
} from 'react-native';
import Button from 'react-native-button';
import * as Animatable from 'react-native-animatable';


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
      };

      AsyncStorage.getItem('notes').then((notes) => {
                if(notes === ''){
                    this.setState({ 'storedNote': '' })
                  }
                else{
                    this.setState({ 'storedNote': JSON.parse(notes) }) 
                  }
            })

      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  componentDidMount() {
      // AsyncStorage.removeItem('remainingtrials')
      Mixpanel.track("DictationScreen Loaded");
      this._getProducts()
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
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

  


  // -----------------------------------------------------------------------------------------------------------------------


  // EVENT CALLED ONLY IF THERE ARE RESULTS AND WHEN FINAL RESULTS ARE IN BACK FROM SERVER – CAN BE DELAYED AFTER STOP
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
    }



  // START RECOGNITION
  async _startRecognition(e) {
      Mixpanel.track("Recognition Started");
      this.state.previousNote !== null ? this.setState({previousNote: this.state.storedNote}) : this.setState({previousNote: this.state.storedNote})

      this.setState({
        recognized: '',
        started: '',
        results: [],
        recording: true
      });
      try {
        await Voice.start('en-US');
      } catch (e) {
        console.error(e);
      }
    }

  // STOP RECOGNITION
  async _stopRecognition(e) {
      try {
        await Voice.stop();
      } catch (e) {
        console.error(e);
      }
      this.setState({stopping: true})

      // CASE UNDEFINED
      if (this.state.results[0] === undefined){
          this.setState({noInput: true, recording: false, stopping: false})
          setTimeout(() => { 
              this.setState({noInput: false})
            }, 5000);
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



  // TOGGLE RECOGNITION
  _toggleRecognizing(e) {
      if (this.state.recording === false) { 
        
        // Play the sound with an onEnd callback
        blip.play();
        // Vibration.vibrate()

        this._startRecognition(e);
        setTimeout(() => { 
            if (this.state.recording === true){
                this._stopRecognition(e); 
                
                blip.play();

              }
         }, 55000);
       }
      else{
        this._stopRecognition(e)
        
        blip.play();
        Vibration.vibrate()
        
       }
    }

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
                      <Text style={style={textAlign: 'center', padding: 8}}>
                        {this.state.storedNote}
                        {'\u00A0'}
                        {this.state.recording === true ? this.state.results[0] : null }
                        {this.state.storedNote || this.state.results[0] ? null : <Text style={{color: 'lightgrey'}}> {'\n'} Press "Dictate" below and speak your note. {'\n'}{'\n'}Say commands like "Period", "Questionmark", "Semicolon", "New Line" etc. to structure your note.</Text>}
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
                            
                            <Button 
                              style={[{color: 'salmon', borderColor: 'salmon'}, styles.button, styles.border]}
                              disabled={this.state.editing || this.state.recording }
                              styleDisabled={[styles.borderDisabled, {color: 'lightgrey'}]}
                              onPress={this.delete.bind(this)}
                              >Delete</Button>

                            
                            <Button 
                              style={[{borderColor: '#2191fb'}, styles.button, styles.border]}
                              disabled={this.state.editing || this.state.recording }
                              styleDisabled={styles.borderDisabled}
                              onPress={this.undo.bind(this)}
                              >Undo</Button>


                            <Button 
                              style={[{borderColor: '#2191fb'}, styles.button, styles.border]}
                              disabled={this.state.editing || this.state.recording }
                              styleDisabled={styles.borderDisabled}
                              onPress={this.copy.bind(this)}
                              >Copy</Button>

                            
                            <Button
                              style={[{borderColor: '#2191fb'}, styles.button, styles.border]}
                              disabled={ this.state.editing || this.state.recording }
                              styleDisabled={styles.borderDisabled}
                              onPress={this.email.bind(this)}
                              >Send</Button>

                        </View>
                      </Animatable.View>
                      :
                      null 
                }
                
                { !this.state.subscribed ? 
                  <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                    <Text style={{color: '#2191fb', textAlign: 'center', paddingBottom: 5}}>
                      Remaining Free Dictations: {this.state.remaining}
                    </Text> 
                  </Animatable.View>
                  :
                  null
                }

                {!this.state.editing ?
                      <Animatable.View animation="slideInUp" duration={400} easing="ease-out">
                        <Button 
                          style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                          disabled={this.state.stopping || !this.state.unlocked }
                          styleDisabled={styles.bottomButtonDisabled}
                          onPress={this._toggleRecognizing.bind(this)}
                          >{this.state.recording === false ? "Start Dictation" : "Stop"}</Button>
                      </Animatable.View>
                      : null
                }

                

                {!this.state.unlocked ? 

                    <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                      <Button
                        style={[{backgroundColor: '#2191fb'}, styles.bottomButton]}
                        styleDisabled={styles.bottomButtonDisabled}
                        onPress={() => this.props.navigation.navigate('AuthScreen')}
                        >Start Free Trial to continue</Button>
                    </Animatable.View> : null
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
      fontWeight: '400'
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
      marginTop: 3
    },
    bottomButton:{
      color: 'white',
      padding: 15,
      margin: '4%',
      marginTop: 0,
      width: '92%',
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
      backgroundColor: 'lightgrey', 
      width: '92%',
      borderWidth: 0,
      borderRadius: 10,
      overflow:'hidden',
      fontSize: 18,
      fontWeight: '600'
    },
    border:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 6,
      paddingBottom: 6,
    },
    borderDisabled:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 6,
      paddingBottom: 6,
      borderColor: 'lightgrey'
    }
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);