/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';

class SideMenu extends Component {

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 100, backgroundColor: 'grey'}}>
            <Text style={{padding: 30}}>Pokédoc</Text>
        </View>
        
        <ScrollView
          contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}
           >
            
            <TouchableOpacity 
                style={{paddingLeft: 20, paddingBottom: 20}}
                onPress={this.props.navigation.navigate('DictationScreen')}
                >
              <Text>Nicholas Dunkel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{paddingLeft: 20, paddingBottom: 20}}
                onPress={this.props.navigation.navigate('DictationScreen')}
                >
              <Text>Libo Wang</Text>
            </TouchableOpacity>

        </ScrollView>
        
      </View>
    );
  }
}

export default SideMenu;