import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
} from 'react-native';

import Voice from 'react-native-voice';

import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let blip = new Sound('blip.m4a', Sound.MAIN_BUNDLE, (error) => {
              if (error) {
                  console.log('failed to load the sound', error);
              } else {
                  // blip.play(); // have to put the call to play() in the onload callback
              }
          });



export default class VoiceNative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
    };

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
    blip.play()
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

async _stopRecognition(e) {
    blip.play()
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }



toggleRecognizing() {
    // Vibration.vibrate();
    // ReactNativeHapticFeedback.trigger('impactLight', true);
    ReactNativeHapticFeedback.trigger('impactLight', true);
    
    if (this.state.started === '√') { 
      Keyboard.dismiss()
      this._startRecognizing();
      setTimeout(() => { 
          this.setState({recording: false })
          console.log('stop recording')
          this._stopRecognizing()
       }, 60000);
     }
    else{
      this.setState({recording: false })
      console.log('stop recording')
      this._stopRecognizing()
     }
  }


render () {
    return (
      <View>
        <Text style={styles.transcript}>
            Transcript
        </Text>
        {this.state.results.map((result, index) => <Text style={styles.transcript}> {result}</Text>
        )}
        <Button style={styles.transcript}
        onPress={this._startRecognition.bind(this)}
        title="Start"></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    top: '400%',
  },
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);