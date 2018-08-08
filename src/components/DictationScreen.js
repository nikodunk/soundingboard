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
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  YellowBox,
  Linking,
  ImageBackground
} from 'react-native';

import Voice from 'react-native-voice';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { fetchData, putData } from '../actions/actions';
import TouchID from 'react-native-touch-id';
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
let tracker = new GoogleAnalyticsTracker("UA-120230032-1");
YellowBox.ignoreWarnings(['Class RCTCxxModule']);


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
          originalCursorStart: 0,
          originalCursorEnd: 0,
          originalCursorLocation: 0,
          previousNote: 0,
          typing: false,
          typingTimeOut: 0,
          serverUp: false,
          email: '',
          unlocked: true,
          enrolledInBiometry: true,
          keyboardUp: false,
          notes: [[' ', ' ', ' ', ' '], [' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ']]
        };
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
        this.timeout =  0;
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
  }

  componentDidMount() {
    // TouchID.isSupported()
    //   .then(biometryType => {
    //     // Success code
    //     TouchID.authenticate('Unlock with your fingerprint')
    //     .then(success =>
    //       this.setState({ unlocked: true }),
    //       );
    //     }
    //   )
    //   .catch(error => {
    //     this.setState({ unlocked: true }),
    //     this.setState({ enrolledInBiometry: false })
    //     console.log('your device doesnt support touchID');
    //     }
    //   );
    this.setState({serverUp: true})
    this.state.originalCursorLocation = this.state.cursorLocation
    this.setState({cursorLocation: {end: 0, start: 0} })
    
    this._getNotes()

    tracker.trackScreenView("Home");
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
        let patientID = this.props.navigation.getParam('id', '0')
        {this.state.recording ? this._stopRecognizing(e) : null }
        this.setState({cursorLocation: {end: 0, start: 0} })
        Keyboard.dismiss()
        this.props.navigation.openDrawer()
  }

  changeNote(text){
    let patientID = this.props.navigation.getParam('id', '0')
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      var newNote = this.state.notes
      newNote[patientID][this.state.activeField] = text;
      this.setState({notes: newNote})
      this._storeNotes()
    }, 500);
  }


  undo() {
    let patientID = this.props.navigation.getParam('id', '0')
    let newNote = this.state.notes
    newNote[patientID][this.state.activeField] = this.state.previousNote
    this.setState({notes: newNote})
    this._storeNotes()
  }

  clear() {
    let patientID = this.props.navigation.getParam('id', '0')
    let newNote = this.state.notes
    newNote[patientID] = [' ', ' ', ' ', ' ']
    this.setState({notes: newNote})
    this._storeNotes()
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
    let patientID = this.props.navigation.getParam('id', '0')
    this.setState({previousNote: this.state.notes[patientID][this.state.activeField] })
    this.setState({originalNote: this.state.notes[patientID][this.state.activeField] })
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
    let patientID = this.props.navigation.getParam('id', '0')
    let newNote = this.state.notes
    newNote[patientID][this.state.activeField] = this.state.originalNote.slice(0, this.state.originalCursorStart) + ' ' + this.state.results[0] + ' ' + this.state.originalNote.slice(this.state.originalCursorEnd, this.state.originalNote.length)
  }

  async _stopRecognizing(e) {
    let patientID = this.props.navigation.getParam('id', '0')
    try {
      await Voice.stop();
      let patientID = this.props.navigation.getParam('id', '0')
      if (this.state.results[0] === undefined){Alert.alert('Sorry, what now?! No Voice input detected! Please speak louder, get better WiFi, or give your connection more time.')}
      else {
        let newNote = this.state.notes
        newNote[patientID][this.state.activeField] = this.state.originalNote.slice(0, this.state.originalCursorStart) + ' ' + this.state.results[0] + ' ' + this.state.originalNote.slice(this.state.originalCursorEnd, this.state.originalNote.length)
        this._storeNotes()
      }
    } catch (e) {
      console.error(e);
    }
  }

  keyboardToggle(){
    if(this.state.keyboardUp){
          Keyboard.dismiss()
          this.setState({keyboardUp: false})
        }
    else{
      this.myTextInput.focus() 
      this.setState({keyboardUp: true})
    }
  }


  email(){
    AsyncStorage.getItem('email').then((res) => {
      tracker.trackEvent("buttonexport", "exported email");
      Platform.OS === 'ios'
        ? Linking.openURL('mailto:'+res+' ?cc=&subject=Export from Soapdictate Slot '+this.props.navigation.getParam('id', '0')+'&body='+this.props.navigation.getParam('id', '0')+'&body='+this.state.notes[this.props.navigation.getParam('id', '0')].toString().replace(/,/g, '\n\n')) 
        : Linking.openURL('mailto:'+res+' ?cc=&subject=yourSubject&body=yourMessage')
    })
  }

  _getNotes(){
    AsyncStorage.getItem('notes').then((res) => {
        if (res != null) {
          let newNote = JSON.parse(res)
          this.setState({notes: newNote})
        }
      })
  }

  _storeNotes(){
    AsyncStorage.setItem('notes', JSON.stringify(this.state.notes))
  }

  render() {
    return (
    <ImageBackground source={require('../../assets/2.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
    
      
      <View style={{flex: 1, width: '100%'}}>
      { this.state.unlocked ? 
        
        <Animatable.View animation="slideInLeft" duration={300} easing="ease-out" style={{marginTop: 30, marginLeft: 10, flexDirection: 'row'}}>
          <TouchableOpacity
              onPress={() => this.openDrawer() }
              activeOpacity={.4}
              style={styles.hamburgerBar}>
                  <Image style={styles.hamburger} source={require('../../assets/hamburger.png')} />
                  <Text style={styles.title}><Text>Slot {this.props.navigation.getParam('id', '0')} </Text></Text>
          </TouchableOpacity>
        </Animatable.View> : null }

        { this.state.unlocked ? 
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            

            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {this.setState({ activeField: 0})}}>
                  <Text style={this.state.activeField === 0 ? styles.labelSelected : styles.label} 
                    >Subjective
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder = "Start recording or typing"
                  ref={(input) => { this.myTextInput = input; }}
                  selectable={true}
                  underlineColorAndroid="transparent"
                  style={this.state.activeField === 0 ? styles.textInputSelected : styles.textInput}
                  value={this.state.notes[this.props.navigation.getParam('id', '0')][0]}
                  multiline={true}
                  onFocus={() => {this.setState({keyboardUp: true, activeField: 0})}}
                  onChangeText={text => this.changeNote(text)}
                  onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
                />
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {this.setState({ activeField: 1})}}>
                  <Text style={this.state.activeField === 1 ? styles.labelSelected : styles.label} 
                    >Objective
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder = "Start recording or typing"
                  ref={(input) => { this.myTextInput = input; }}
                  selectable={true}
                  underlineColorAndroid="transparent"
                  style={this.state.activeField === 1 ? styles.textInputSelected : styles.textInput}
                  value={this.state.notes[this.props.navigation.getParam('id', '0')][1]}
                  multiline={true}
                  onFocus={() => {this.setState({keyboardUp: true, activeField: 1})}}
                  onChangeText={text => this.changeNote(text)}
                  onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
                />
              </View>

              <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {this.setState({ activeField: 2})}}>
                  <Text style={this.state.activeField === 2 ? styles.labelSelected : styles.label} 
                    >Assessment
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder = "Start recording or typing"
                  ref={(input) => { this.myTextInput = input; }}
                  selectable={true}
                  underlineColorAndroid="transparent"
                  style={this.state.activeField === 2 ? styles.textInputSelected : styles.textInput}
                  value={this.state.notes[this.props.navigation.getParam('id', '0')][2]}
                  multiline={true}
                  onFocus={() => {this.setState({keyboardUp: true, activeField: 2})}}
                  onChangeText={text => this.changeNote(text)}
                  onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
                />
              </View>

              <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {this.setState({ activeField: 3})}}>
                  <Text style={this.state.activeField === 3 ? styles.labelSelected : styles.label} 
                    >Plan
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder = "Start recording or typing"
                  ref={(input) => { this.myTextInput = input; }}
                  selectable={true}
                  underlineColorAndroid="transparent"
                  style={this.state.activeField === 3 ? styles.textInputSelected : styles.textInput} 
                  value={this.state.notes[this.props.navigation.getParam('id', '0')][3]}
                  multiline={true}
                  onFocus={() => {this.setState({keyboardUp: true, activeField: 3})}}
                  onChangeText={text => this.changeNote(text)}
                  onSelectionChange={(event) => {this.setState({cursorLocation: event.nativeEvent.selection}) }}
                />
              </View>
            </View>
              
              
              <Animatable.View animation="slideInLeft" duration={400} easing="ease-out" style={{flexDirection: 'row', height: 100}}>
                <TouchableOpacity 
                    onPress={() => Alert.alert(
                                          'Clear note?',
                                          'This resets the note to blank and cannot be undone.',
                                          [
                                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                            {text: 'OK', onPress: () => this.clear() },
                                          ]
                                        )}
                  >
                    <Image style={{height: 30, width: 30, marginRight: 20, marginTop: 40}}  source={ require('../../assets/delete.png') } />
                </TouchableOpacity>

                {this.state.previousNote ? 
                  <View>
                    <TouchableOpacity
                         onPress={  () => this.undo() }
                         activeOpacity={.8}>
                         <Image style={{height: 30, width: 30, marginRight: 20, marginTop: 40}}  source={ require('../../assets/undo.png') } />
                    </TouchableOpacity>
                </View> : 
                <View>
                       <Image style={{height: 30, width: 30, marginRight: 20, marginTop: 40, opacity: .2}}  source={ require('../../assets/undo.png') } />
                </View> }


                
                  <View style={!this.state.recording ? styles.buttonImageContainer : styles.buttonImageContainerRecording}> 
                    <TouchableOpacity
                         onPress={  () => {this.toggleRecognizing();} }
                         activeOpacity={.8}>
                         <Image style={styles.buttonImage} ref={this.handleImageRef} source={!this.state.recording ? require('../../assets/button.png') : require('../../assets/buttonRecording.png')} />
                    </TouchableOpacity>
                  </View>
                
                
              
                <View>
                  <TouchableOpacity
                       onPress={ () => this.keyboardToggle() }
                       activeOpacity={.8}>
                       <Image style={{height: 30, width: 30, marginLeft: 20, marginTop: 40}}  source={ require('../../assets/keyboard.png') } />
                  </TouchableOpacity>
                </View>
                
                <View>
                  <TouchableOpacity
                       onPress={ () => this.email()
                           }
                       activeOpacity={.8}>
                       <Image style={{height: 30, width: 30, marginLeft: 20, marginTop: 40}}  source={ require('../../assets/mail.png') } />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
              
          </KeyboardAvoidingView>
        : null }
      </View>

  </ImageBackground>
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
        notes: state.items.notes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (patientID) => dispatch(fetchData(patientID)),
        putData: (phoneNo, patientid, note0, note1, note2, note3) => dispatch(putData(phoneNo, patientid, note0, note1, note2, note3)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DictationScreen);
