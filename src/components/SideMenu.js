 import PropTypes from 'prop-types';
 import React, {PureComponent} from 'react';
 import {NavigationActions} from 'react-navigation';
 import {ScrollView, Text, View, TouchableOpacity, AsyncStorage, Image, Platform, Linking} from 'react-native';
 import styles from './_styles'
 import { connect } from 'react-redux';
 import DictationScreen from './DictationScreen'
 import { DrawerActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';

 class SideMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
          this.setState({loading: true})
          AsyncStorage.getItem('email').then((res) => {
              this.setState({email: res});
              this.setState({loading: false})
              fetch('https://healthnotes.herokuapp.com/email/', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: res
                  }),
              }).then(() => console.log('email saved to server'))
          })
      }
  

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  render () {
    return (
      <View style={{flex: 1, marginTop: 50}}>        
        <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column'}}>
      
          <View>
              <TouchableOpacity 
              style={{paddingLeft: 20, paddingBottom: 20}}
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.closeDrawer())
                this.props.navigation.navigate('DictationScreen', {id: '0'})
              }}>
              <Text style={styles.sidebarText}>Slot 0</Text>
              
              </TouchableOpacity>
              <View style={styles.separator} />
          </View>

          <View>
              <TouchableOpacity 
              style={{paddingLeft: 20, paddingBottom: 20}}
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.closeDrawer())
                this.props.navigation.navigate('DictationScreen', {id: '1'})
              }}>
              <Text style={styles.sidebarText}>Slot 1</Text>
              
              </TouchableOpacity>
              <View style={styles.separator} />
          </View>

          <View>
              <TouchableOpacity 
              style={{paddingLeft: 20, paddingBottom: 20}}
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.closeDrawer())
                this.props.navigation.navigate('DictationScreen', {id: '2'})
              }}>
              <Text style={styles.sidebarText}>Slot 2</Text>
              
              </TouchableOpacity>
              <View style={styles.separator} />
          </View>
        
        </ScrollView>

        <View style={{flex: 1}}>
          <TouchableOpacity style={{paddingLeft: 5, paddingBottom: 5, position: 'absolute', bottom: 10, marginLeft: 5}}
                    onPress={() => {
                    this.props.navigation.navigate('DrawerClose')
                    this.props.navigation.navigate('Settings')
                  }}>
              <Text style={[styles.sidebarText, styles.outlineButton]}>Settings</Text>
              
          </TouchableOpacity>
        </View>


       
          <Animatable.View animation="slideInUp" duration={300} easing="ease-out" style={{height: 100, backgroundColor: '#2191fb'}}>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={styles.sidebarTitle}>soap dictate</Text>
                <Image style={{height: 60, width: 60}} source={require('../../assets/logo.png')} />

              </View>
              <Text style={{color: 'white', paddingLeft: 5}}>{this.state.email}</Text>
          </Animatable.View>
          
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

    export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);