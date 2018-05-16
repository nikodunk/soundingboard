import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    

    // general 
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
      },

    //dictation
    hamburgerBar:{
      flexDirection: 'row', 
      marginTop: 15, 
    },
    hamburger: {
        height: 16  ,
        width: 25,
        margin: 10,
        marginTop: 8
      },
    title:{
        fontWeight: '900',
        fontSize: 25,
      },
    instructions: {
      color: '#333333',
      marginLeft: 45
    },
    textInput:{
      height: 100, 
      width: 300, 
      borderColor: 'gray', 
      borderWidth: 1, 
      borderRadius: 5, 
      padding: 5, 
      margin: 5
    },
    textInputSelected:{
      height: 100, width: 300, borderColor: 'darkgrey', borderWidth: 1, borderRadius: 5, padding: 5, margin: 5, backgroundColor: 'rgb(220, 240, 250)'
    },


    
    // sidebar
    sidebarText: {
      fontSize: 20,
    },
    sidebarTitle:{
        fontWeight: '900',
        fontSize: 25,
        margin: 10,
        color: 'white'
      },
    separator:{
        height: 1,
        backgroundColor: "lightgrey",
        marginBottom: 10
      },


      // other
      
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
      

      buttonImageContainer: {
        position: 'absolute', 
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: .8,
        shadowRadius: 5,
        elevation: 5
      },




      // login shiat
      loginContainer:{
        marginTop: 0,
        flex: 1
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
}); 