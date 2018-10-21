import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
  AsyncStorage,
  Linking,
  Platform,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

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
      previousNote: null
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

async _stopRecognition(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    this.setState({recording: false})
    
    if (this.state.results[0] === undefined){
        setTimeout(() => { 
            this.setState({noInput: false})
          }, 5000);
        this.setState({noInput: true})
      }
    else {
      var newNote
      this.state.storedNote ? newNote = this.state.storedNote + ' ' + this.state.results[0] : newNote = this.state.results[0] 
      AsyncStorage.setItem('notes', JSON.stringify(newNote))
      this.setState({ 'storedNote': newNote });
    }
  }



_toggleRecognizing(e) {
    if (this.state.recording === false) { 
      
      // Play the sound with an onEnd callback
      blip.play();

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
  AsyncStorage.removeItem('notes')
  this.setState({storedNote: ''})
}

undo(){
  if (this.state.previousNote !== null ){ 
      AsyncStorage.setItem('notes', JSON.stringify(this.state.previousNote)); 
      this.setState({storedNote: this.state.previousNote})
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
    this.myTextInput.focus();
    this.setState({editing: true})
    this.setState({editedText: this.state.storedNote})
  }
  else return
      
  
}


render () {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        
          
            
            { this.state.storedNote ?
              <View style={styles.topBar}>
                <Button 
                  onPress={this.undo.bind(this)}
                  title={"Undo"} ></Button>

                <Button 
                  style={{color: 'lightblue'}}
                  onPress={this.delete.bind(this)}
                  title={"Delete"} ></Button>

                {!this.state.editing ? 
                  <Button
                    onPress={this._toggleEditing.bind(this)}
                    title={"Edit"} ></Button>
                  :
                  <Button 
                    onPress={this._toggleEditing.bind(this)}
                    title={"Done"} ></Button>}
              </View>
            : null }

          
          
          <View style={styles.transcript}>
            <Text style={style={textAlign: 'center'}}>
                Transcript
            </Text>

            { this.state.editing ? 
              <TextInput
                       style={styles.textInput}
                       multiline = {true}
                       ref={(input) => { this.myTextInput = input; }}
                       onChangeText={(text) => this.setState({editedText: text})}
                       value={this.state.editedText}
                     />
              :
              <Text style={style={textAlign: 'center'}}>
                {this.state.storedNote}
                {'\u00A0'}
                {this.state.recording === true ? this.state.results[0] : null }
              </Text> }

            { this.state.noInput ? 
              <Text style={{color: 'red'}}>
                No Voice input detected! Please speak louder, get better WiFi, or give your connection more time.
              </Text> :
              null
            }


          </View>
          
          {!this.state.editing ? 
            <View style={styles.bottomBar}>

              <Button
              color="red"
              onPress={this._toggleRecognizing.bind(this)}
              title={(this.state.recording === false ? "Dictate" : "Stop")} ></Button>

              { this.state.storedNote ?
                <Button
                onPress={this.email.bind(this)}
                title={"Email"} ></Button>
                : null }

            </View>
            : null}


        
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
    justifyContent: 'space-between'
  },
  transcript: {
    marginTop: 20,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginBottom: 20
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
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);