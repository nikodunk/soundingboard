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
      textInputSelected:{
        height: 100, width: 300, borderColor: 'darkgrey', borderWidth: 1, borderRadius: 5, padding: 5, margin: 5, backgroundColor: 'rgb(220, 240, 250)'
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
}); 