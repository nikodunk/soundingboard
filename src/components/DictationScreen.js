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
  blip.setVolume(6)
  console.log('Volume: ' + blip.getVolume() + ' number of channels: ' + blip.getNumberOfChannels());
});


export default class VoiceNative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
      recording: 'no'
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
    this.setState({
      recognized: '',
      started: '',
      results: [],
      recording: 'yes'
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
    this.setState({recording: 'no'})
  }



_toggleRecognizing(e) {
    if (this.state.recording === 'no') { 
      
      // Play the sound with an onEnd callback
      blip.play();

      this._startRecognition(e);
      setTimeout(() => { 
          if (this.state.recording === 'yes'){
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
      ? Linking.openURL('mailto:'+email+' ?cc=&subject=Export from Soapdictate &body='+this.state.results[0]) 
      : Linking.openURL('mailto:'+email+' ?cc=&subject=yourSubject&body=yourMessage')
  })
}


render () {
    return (
      <View style={styles.container}>
        <Text style={styles.transcript}>
            Transcript{"\n"}
            {this.state.results.map((result, index) => <Text style={styles.transcript} key={index}> {result}</Text>
        )}
        </Text>
        
        <View style={styles.button}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            
            <Button
            onPress={this._toggleRecognizing.bind(this)}
            title={(this.state.recording === 'no' ? "Dictate" : "Stop")} ></Button>

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
    height: '100%',
    flex: 1,
    flexDirection: 'column'
  },
  transcript: {
    textAlign: 'center',
    marginTop: 40,
  },
  button: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);