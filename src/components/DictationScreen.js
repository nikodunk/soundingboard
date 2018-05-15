import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput, Keyboard
} from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';
import styles from './_styles'
import { YellowBox } from 'react-native';

import { connect } from 'react-redux';
import { fetchData } from '../actions/actions';


type Props = {};

class App extends Component<Props> {
    constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      activeField: 0,
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
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
  }

  componentDidMount() {
    let textinput = []
    textinput[0] = ''
    textinput[1] = ''
    textinput[2] = ''
    textinput[3] = ''
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
      textinput[0] = this.state.textinput[0]
      textinput[1] = this.state.textinput[1]
      textinput[2] = this.state.textinput[2]
      textinput[3] = this.state.textinput[3]
      textinput[this.state.activeField] = textinput[this.state.activeField] + ' ' + this.state.results[0]
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

  onFocus(arrayNumber){
    Keyboard.dismiss()
    this.setState({activeField: arrayNumber})
    console.log(arrayNumber)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{marginTop: 30, marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.welcome}>Patient Nicholas Dunkel</Text>
          </View>
          <Text style={styles.instructions}>
              Press the button and start speaking.
          </Text>
        </View>
        <View style={styles.container}>
          

          <Text>HPI</Text>
          <TextInput
            style={this.state.activeField === 0 ? styles.textInputSelected : styles.textInput}
            onChangeText={(text) => this.setState({text})}
            onFocus={() => this.onFocus(0)}
            value={this.state.textinput[0]}
            multiline={true}
          />

          <Text>Social History</Text>
          <TextInput
            style={this.state.activeField === 1 ? styles.textInputSelected : styles.textInput}
            onChangeText={(text) => this.setState({text})}
            onFocus={() => {this.onFocus(1)}}
            value={this.state.textinput[1]}
            multiline={true}
          />

          <Text>Review of Systems</Text>
          <TextInput
            style={this.state.activeField === 2 ? styles.textInputSelected : styles.textInput}
            onChangeText={(text) => this.setState({text})}
            onFocus={() => this.onFocus(2)}
            value={this.state.textinput[2]}
            multiline={true}
          />

          <Text>Assessment</Text>
          <TextInput
            style={this.state.activeField === 3 ? styles.textInputSelected : styles.textInput}
            onChangeText={(text) => this.setState({text})}
            onFocus={() => this.onFocus(3)}
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

          <View style={[styles.buttonImageContainer, { bottom: 10, right: 10, }]}> 
            <TouchableOpacity
                 onPress={  () => {this.toggleRecognizing();} }
                 activeOpacity={.8}>
                 <Image style={styles.buttonImage} ref={this.handleImageRef} source={require('../../assets/button.png')} />
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonImageContainer, { bottom: 10, left: 10, }]}> 
            <TouchableOpacity
                 onPress={() => this.props.navigation.openDrawer()}
                 activeOpacity={.8}>
                 <Image style={styles.buttonImage} ref={this.handleImageRef} source={require('../../assets/hamburger.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

  
const mapStateToProps = (state) => {
    return {
        items: state.items,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (phone) => dispatch(fetchData(phone))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

