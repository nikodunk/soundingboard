import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';




type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      textinput: [],
      recording: false
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  componentDidMount() {
    console.log('yay!')
    let textinput = []
    textinput[0] = 'History of present illness:\n\n medical history\n\n surgical history\n\n family history\n\n social history\n'
    textinput[1] = 'Review of Systems\n\nFindings from Exam \n\nLab Results'
    textinput[2] = 'Summary:\n'
    textinput[3] = 'Summary:\n'
    this.setState({textinput: textinput})

  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: '√',
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
      let textinput = [] 
      textinput[0] = this.state.textinput[0] + this.state.results[0]
      textinput[1] = this.state.textinput[1]
      textinput[2] = this.state.textinput[2]
      textinput[3] = this.state.textinput[3]
      this.setState({
        textinput: textinput
      })
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
  }

  toggleRecognizing() {
    if (this.state.recording === false) { 
      this.setState({recording: true}) 
      console.log('start recording')
      this._startRecognizing(); 
     }
    else{
      this.setState({recording: false })
      console.log('stop recording')
      this._stopRecognizing();
     }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{marginTop: 30, marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{height: 30, width: 30, marginTop: 6}} source={require('../assets/hamburger.png')} />
            <Text style={styles.welcome}>Libo's-most-hated-EMR-section APP</Text>
          </View>
          <Text style={styles.instructions}>
              Press the button and start speaking.
          </Text>
        </View>
        <View style={styles.container}>
          

          <Text> subjective component (story) </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({text})}
            value={this.state.textinput[0]}
            multiline={true}
          />

          <Text> objective component </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({text})}
            value={this.state.textinput[1]}
            multiline={true}
          />

          <Text> assessment (hypothesis) </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({text})}
            value={this.state.textinput[2]}
            multiline={true}
          />

          <Text>plan</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({text})}
            value={this.state.textinput[3]}
            multiline={true}
          />

          {this.state.results.map((result, index) => {
            return (
              <Text
                key={`result-${index}`}>
                {result}
              </Text>
            )
          })}

          <View style={{position: 'absolute', bottom: 10, right: 10}}> 
            <TouchableOpacity
                 onPress={  () => {this.toggleRecognizing();} }
                 activeOpacity={.8}>
                 <Image style={styles.buttonImage} ref={this.handleImageRef} source={require('../assets/button.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    margin: 10,
  },
  instructions: {
    color: '#333333',
    marginBottom: 20,
    marginLeft: 40
  },
  textInput:{
    height: 100, width: 300, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 5, margin: 5
  },
  buttonImage:{
        width: 80,
        height: 80,
      },

});
