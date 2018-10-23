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
  ScrollView
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
  // blip.setVolume(6)
  console.log('Volume: ' + blip.getVolume() + ' number of channels: ' + blip.getNumberOfChannels());
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
      stopping: false
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

// EVENT CALLED ONLY IF THERE ARE RESULTS
// AND WHEN FINAL RESULTS ARE IN BACK FROM REMOTE – CAN BE DELAYED AFTER BUTTON CLICKED
onSpeechEnd(e) {
    
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
  AsyncStorage.getItem('email').then((email) => {
    // tracker.trackEvent("buttonexport", "exported email");
    Platform.OS === 'ios'
      ? Linking.openURL('mailto:'+email+' ?cc=&subject=Export from Soapdictate &body='+ this.state.storedNote) 
      : Linking.openURL('mailto:'+email+' ?cc=&subject=yourSubject&body=yourMessage')
  })
}

delete(){
  this.setState({previousNote: this.state.storedNote})
  AsyncStorage.removeItem('notes')
  this.setState({storedNote: ''})
}

undo(){
  if (this.state.previousNote !== null ){ 
      AsyncStorage.setItem('notes', JSON.stringify(this.state.previousNote)); 
      destroyedNote = this.state.storedNote
      this.setState({storedNote: this.state.previousNote})
      this.setState({previousNote: destroyedNote})
     }
  else return
}

_toggleEditing(){
  if (this.state.editing === true){
    // stop editing and save
    this.setState({editing: false})
    AsyncStorage.setItem('notes', JSON.stringify(this.state.editedText))
    this.setState({storedNote: this.state.editedText})
  }
  if (this.state.editing === false){
    // start editing
    
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
                  style={styles.button}
                  disabled={this.state.recording || this.state.editing }
                  onPress={() => this.props.navigation.navigate('Settings')}
                  >Settings</Button>

                <Text style={{padding: 8, fontSize: 20}}>Transcript     </Text>

                {!this.state.editing ? 
                  <Button
                    style={styles.button}
                    disabled={this.state.recording || !this.state.storedNote}
                    onPress={this._toggleEditing.bind(this)}
                    >Edit</Button>
                  :
                  <Button
                    style={styles.button} 
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
          
          
          { this.state.storedNote && !this.state.editing ?
                <Animatable.View animation="slideInUp" duration={400} easing="ease-out">
                  <View style={styles.optionBar}>
                      
                      <Button 
                        style={styles.button}
                        disabled={this.state.editing || this.state.recording }
                        onPress={this.delete.bind(this)}
                        >Delete</Button>

                      
                      <Button 
                        style={styles.button}
                        disabled={this.state.editing || this.state.recording }
                        onPress={this.undo.bind(this)}
                        >Undo</Button>

                      
                      <Button
                        style={styles.button}
                        disabled={ this.state.editing || this.state.recording }
                        onPress={this.email.bind(this)}
                        >Email</Button>

                  </View>
                </Animatable.View>
                :
                null 
          }
          

          {!this.state.editing ?
                <Animatable.View animation="slideInUp" duration={400} easing="ease-out" style={styles.bottomBar}>
                  <Button
                    style={styles.bottomButton}
                    disabled={this.state.stopping }
                    styleDisabled={styles.bottomButtonDisabled}
                    onPress={this._toggleRecognizing.bind(this)}
                    >{this.state.recording === false ? "Dictate" : "Stop"}</Button>
                </Animatable.View>
                : null
          }
          


        
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column'
  },
  topBar:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  transcript: {
    flex: 1,
  },
  button:{
    padding: 8, 
    fontSize: 18, 
    fontWeight: '400',
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
    justifyContent: 'space-around'
  },
  bottomButton:{
    color: 'white',
    padding: 15,
    margin: '4%',
    backgroundColor: '#2191fb', 
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
  }
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);