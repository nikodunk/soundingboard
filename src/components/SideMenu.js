/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import styles from './_styles'
import { connect } from 'react-redux';
import DictationScreen from './DictationScreen'
 

class SideMenu extends PureComponent {

  render () {
    const { navigate, state } = this.props.navigation;

    return (
      <View style={{flex: 1, marginTop: 30}}>        
        <ScrollView
          contentContainerStyle={{ flex: 1, flexDirection: 'column'}}
           >
           {this.props.items.notes ? Object.keys(this.props.items.notes).map((id) =>
                    <View key={id}>
                        <TouchableOpacity 
                            style={{paddingLeft: 20, paddingBottom: 20}}
                            onPress={() => {
                                    
                                    this.props.navigation.navigate('DictationScreen', {patientId: id})
                                  }}>
                      
                              <Text style={styles.sidebarText}>{this.props.items.notes[id][0].name}</Text>
                        
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </View>
                    ) : null }
        </ScrollView>

        <View style={{height: 100, backgroundColor: 'grey'}}>
            <Text style={styles.sidebarTitle}>Pokédoc </Text>
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