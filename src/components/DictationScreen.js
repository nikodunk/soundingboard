import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
  AsyncStorage,
  Linking,
  Platform
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
      previousNote: ''
    };

  AsyncStorage.getItem('notes').then((notes) => {
            this.setState({ 'storedNote': JSON.parse(notes) });
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
    this.setState({previousNote: this.state.storedNote})

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
    var newNote
    this.state.storedNote ? newNote = this.state.storedNote + ' ' + this.state.results[0] : newNote = this.state.results[0] 
    AsyncStorage.setItem('notes', JSON.stringify(newNote))
    this.setState({ 'storedNote': newNote });
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
  AsyncStorage.setItem('notes', this.state.previousNote)
  this.setState({storedNote: this.state.previousNote})
}

toggleEditing(){
  if (this.state.editing === true){
    this.setState({editing: false})
  }
  if (this.state.editing === false){
    this.setState({editing: true})
  }
  else return
      
  
}


render () {
    return (
      <View style={styles.container}>

        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          
          <Button 
          onPress={this.undo.bind(this)}
          title={"Undo"} ></Button>

          <Button 
            onPress={this.delete.bind(this)}
            title={"Delete"} ></Button>

          <Button 
          onPress={this.toggleEditing.bind(this)}
          title={"Edit"} ></Button>

        </View>
        
        <View style={styles.transcript}>
          <Text style={style={textAlign: 'center'}}>
              Transcript
          </Text>

          {this.state.editing ? 
            null
            :
            <Text style={style={textAlign: 'center'}}>
              {this.state.storedNote}
              {this.state.recording === true ? this.state.results[0] : null }
            </Text> }
        </View>
        
        <View style={styles.bottomBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <Button
            onPress={this._toggleRecognizing.bind(this)}
            title={(this.state.recording === false ? "Dictate" : "Stop")} ></Button>

            <Button 
            onPress={this.email.bind(this)}
            title={"Email"} ></Button>

          </View>
        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: '100%',
    flex: 1,
    flexDirection: 'column'
  },
  transcript: {
    marginTop: 20
  },
  bottomBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  }
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);