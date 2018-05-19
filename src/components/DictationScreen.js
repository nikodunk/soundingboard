import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';

import Voice from 'react-native-voice';
import styles from './_styles'
import { YellowBox } from 'react-native';

import { connect } from 'react-redux';
import { fetchData, putData } from '../actions/actions';

type Props = {};

class DictationScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
          recognized: '',
          pitch: '',
          results: [],
          activeField: 0,
          partialResults: [],
          recording: false,
          cursorLocation: null,
          originalNote: '',
          originalCursorStart: null,
          originalCursorEnd: null,
          originalCursorLocation: null
        };
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
  }

  componentDidMount() {
    this.state.originalCursorLocation = this.state.cursorLocation
    this.props.fetchData('9177043031').then((res) => console.log(this.props.items.notes))
  }


  toggleRecognizing() {
    if (this.state.recording === false) { 
      Keyboard.dismiss()
      this.setState({recording: true}) 
      console.log('start recording')
      this._startRecognizing(); 
     }
    else{
      this.setState({recording: false })
      console.log('stop recording')
      this._stopRecognizing()
      
     }
  }

  openDrawer(){
        this.setState({cursorLocation: {end: 0, start: 0} })
        Keyboard.dismiss()
        this.props.navigation.openDrawer();
  }


  render() {
    return (
      <View style={{flex: 1}}>

        <View style={{marginTop: 30, marginLeft: 10}}>
          <TouchableOpacity
              onPress={() => this.openDrawer() }
              activeOpacity={.4}
              style={styles.hamburgerBar}>
                  <Image style={styles.hamburger} source={require('../../assets/hamburger.png')} />
                  <Text style={styles.title}><Text>{this.props.items.notes ? this.props.items.notes[this.props.navigation.getParam('id', '1')][0]["name"] : null}</Text></Text>
          </TouchableOpacity>
        </View>
        
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
              
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={ styles.textInput}
                  value={this.props.items.notes ? this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"] : null}
                  multiline={true}
                  onChangeText={(text) => {this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"] = text; this.props.putData('9177043031', this.props.navigation.getParam('id', '1'), this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"])}}
                  onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
                />
              </TouchableWithoutFeedback>

              <View style={!this.state.recording ? styles.buttonImageContainer : styles.buttonImageContainerRecording}> 
                <TouchableOpacity
                     onPress={  () => {this.toggleRecognizing();} }
                     activeOpacity={.8}>
                     <Image style={styles.buttonImage} ref={this.handleImageRef} source={!this.state.recording ? require('../../assets/button.png') : require('../../assets/buttonRecording.png')} />
                </TouchableOpacity>
              </View>
            
          </KeyboardAvoidingView>
        
      </View>
    );
  }

    componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
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
    let patientID = this.props.navigation.getParam('id', '1')
    this.setState({originalNote: this.props.items.notes[patientID][1]["note"] })
    this.setState({originalCursorStart: this.state.cursorLocation['start']})
    this.setState({originalCursorEnd: this.state.cursorLocation['end']})
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
    let patientID = this.props.navigation.getParam('id', '1')
    this.props.items.notes[patientID][1]["note"] = this.state.originalNote.slice(0, this.state.originalCursorStart) + ' ' + this.state.results[0] + ' ' + this.state.originalNote.slice(this.state.originalCursorEnd, this.state.originalNote.length)
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
      let patientID = this.props.navigation.getParam('id', '1')
      this.props.items.notes[patientID][1]["note"] = this.state.originalNote.slice(0, this.state.originalCursorStart) + ' ' + this.state.results[0] + ' ' + this.state.originalNote.slice(this.state.originalCursorEnd, this.state.originalNote.length)
      this.props.putData('9177043031', patientID, this.props.items.notes[patientID][1]["note"])
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
}

  
const mapStateToProps = (state) => {
    return {
        items: state.items,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (phone) => dispatch(fetchData(phone)),
        putData: (phoneNo, patientid, note) => dispatch(putData(phoneNo, patientid, note)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DictationScreen);