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
          cursorLocation: null
        };
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
  }

  componentDidMount() {
    this.props.fetchData('9177043031').then((res) => console.log(this.props.items.notes))
    
  }

  componentDidUpdate(){
    // console.log(this.props.navigation.state.params)
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
          <TouchableOpacity
               onPress={() => {this.props.navigation.openDrawer(); Keyboard.dismiss()}}
               activeOpacity={.4}
               style={styles.hamburgerBar}>
                  <Image style={styles.hamburger} source={require('../../assets/hamburger.png')} />
                  <Text style={styles.title}><Text>{this.props.items.notes ? this.props.items.notes[this.props.navigation.getParam('id', '1')][0]["name"] : null}</Text></Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
              Press the button and start speaking.
          </Text>
        </View>

        <View style={styles.container}>
          <TextInput
            style={ styles.textInput}
            value={this.props.items.notes ? this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"] : null}
            multiline={true}
            onChangeText={(text) => {this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"] = text; this.props.putData('9177043031', this.props.navigation.getParam('id', '1'), this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"])}}
            onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
          />
          <View style={[styles.buttonImageContainer, { top: 250, right: 10, }]}> 
            <TouchableOpacity
                 onPress={  () => {this.toggleRecognizing();} }
                 activeOpacity={.8}>
                 <Image style={styles.buttonImage} ref={this.handleImageRef} source={require('../../assets/button.png')} />
            </TouchableOpacity>
          </View>
          
            {this.state.results.map((result, index) => {
              return (
                <Text
                  style={{position: 'absolute', top: 290, left: 20, width: 250}}
                  key={`result-${index}`}>
                  {result}
                </Text>
              )
            })}

        </View>
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
      this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"] = this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"].slice(0, this.state.cursorLocation['start']) + ' ' + this.state.results[0] + ' ' + this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"].slice(this.state.cursorLocation['end'], this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"].length)
      this.props.putData('9177043031', this.props.navigation.getParam('id', '1'), this.props.items.notes[this.props.navigation.getParam('id', '1')][1]["note"])
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