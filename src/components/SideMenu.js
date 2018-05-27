/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, TouchableOpacity, AsyncStorage} from 'react-native';
import styles from './_styles'
import { connect } from 'react-redux';
import DictationScreen from './DictationScreen'
import { DrawerActions } from 'react-navigation';


class SideMenu extends PureComponent {


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  render () {
    return (
      <View style={{flex: 1, marginTop: 50}}>        
        <ScrollView
          contentContainerStyle={{ flex: 1, flexDirection: 'column'}}
           >
           
           {this.props.items.notes ? Object.keys(this.props.items.notes).map((id) =>
                    <View key={id}>
                        <TouchableOpacity 
                            style={{paddingLeft: 20, paddingBottom: 20}}
                            onPress={() => {
                                    this.props.navigation.dispatch(DrawerActions.closeDrawer())
                                    this.props.navigation.navigate('DictationScreen', {id: id})
                                  }}>
                              <Text style={styles.sidebarText}>Slot {this.props.items.notes[id] ? this.props.items.notes[id][0]['id'] : null}</Text>
                        
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </View>
                    ) : null }
        </ScrollView>
        
        <View style={{height: 100, backgroundColor: '#00d0c9'}}>
            <Text style={styles.sidebarTitle}>simple soap</Text>
            <TouchableOpacity 
                style={{paddingLeft: 10,  position: 'absolute', bottom: 20}}
                onPress={this._signOutAsync} >
              <Text>
                Logout
              </Text>
            </TouchableOpacity> 
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

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);