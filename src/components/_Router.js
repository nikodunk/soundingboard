import {React, Component} from 'react';
import { ScrollView,  StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { StackNavigator, SwitchNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
// import { connect } from 'react-redux';
// import { getToken } from '../actions/actions';

import DictationScreen from './DictationScreen'
import styles from './_styles'



const SignedInRouter = DrawerNavigator({
	Nicholas: {
	    screen: DictationScreen
	  },
	Libo: {
	    screen: DictationScreen
	  },
	Steven: {
	    screen: DictationScreen
	  }}
)




export default Router = SwitchNavigator(
  {
    SignedInRouter: SignedInRouter,
  },
  {
    initialRouteName: 'SignedInRouter',
  }
);


class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Section 1
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page1')}>
              Page1
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Section 2
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page2')}>
                Page2
              </Text>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page3')}>
                Page3
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
        </View>
      </View>
    );
  }
}
