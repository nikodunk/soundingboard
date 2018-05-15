import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
      
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
      },
      welcome: {
        fontSize: 20,
        margin: 10,
        marginTop: 20
      },
      instructions: {
        color: '#333333',
        marginLeft: 10
      },
      textInput:{
        height: 100, width: 300, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 5, margin: 5
      },
      loginContainer:{
        marginTop: 0,
        flex: 1
      },
      title:{
        fontSize: 40,
        fontWeight: '900',
      },
      subtitle:{
        fontWeight: '900',
        fontSize: 20,
        width: 230,
        textAlign: 'center',
      },
      calendarText:{
        fontSize: 25,
        fontWeight: '900',
      },
      calendarTextSubtitle:{
        fontSize: 20,
        fontWeight: '300',
        marginTop: 3,
      },
      label:{
        color:'lightgrey',
        fontWeight: '700',
      },
      calendar:{
        marginTop: 10
      },
      item:{
        padding: 10,
        marginTop: 10,
        marginRight: 10,
        borderRadius: 10,
      },
      noOneOff:{
        padding: 10,
        margin: 10,
        color: 'darkgrey'
      },
      materialButton: {
        borderWidth:0,
        alignItems:'center',
        justifyContent:'center',
        width: 80,
        height: 80,
        borderRadius:50,
        backgroundColor:'#ff0081',
        opacity: 100,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 5
      },
      materialButtonText:{
        fontSize: 12,
        fontWeight: '900',
        color: 'white'
      },
      materialButtonTextLong:{
        fontSize: 20,
        fontWeight: '900',
        color: 'white'
      },
      flatList:{
        paddingTop: 10
      },
      listItem: {
        flexDirection: 'row',
        padding: 10,
        height: 60,
      },
      image:{
        width: 40,
        height: 40,
        marginRight: 5
      },
      emoji:{
        width: 60,
        height: 60,
        margin: 20,
        opacity: 0.5
      },
      buttonImage:{
        width: 80,
        height: 80,
      },
      text: {
        fontSize: 18,
      },
      separator:{
        height: 1,
        width: "90%",
        backgroundColor: "lightgrey",
        marginLeft: '5%'
      },
      window:{
        margin: 30,
      },
      input:{
        height: 40, 
        width: 200,
        borderColor: 'lightgray', 
        borderWidth: 1,
        marginTop: 10,
        borderRadius:5,
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
      inputShort:{
        height: 40, 
        width: 100,
        borderColor: 'lightgray', 
        borderWidth: 1,
        borderRadius:5,
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
      materialButtonLong: {
        marginTop: 10,
        borderWidth:0,
        alignItems:'center',
        justifyContent:'center',
        width: 275,
        height: 50,
        borderRadius:5,
        backgroundColor:'#2191fb',
        opacity: 100,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 5
      },
      fullScreen: {
        flex: 1,
      },
      shadowBox:{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 7,
      },
      loginBox: {
        flex: 0.6,
        justifyContent:'center',
        alignItems: 'center', 
        width: '80%', 
        marginLeft: '10%',
        marginRight: '10%'
      },
      buttonImageContainer: {
        position: 'absolute', 
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: .8,
        shadowRadius: 5,
        elevation: 5
      },
      picker:{
        width: 200, 
        borderColor: 'lightgrey', 
        borderWidth: 1, 
        marginTop: 10, 
        backgroundColor:'#F5F5F5', 
        borderRadius: 4,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 5
      }
}); 