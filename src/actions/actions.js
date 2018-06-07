import { AsyncStorage } from 'react-native';
import axios from 'axios';



// get to https://healthnotes.herokuapp.com/1/getnotes/9177043031/
export function fetchData(phone) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('fetchData ran', phone)
        axios.get('https://healthnotes.herokuapp.com/1/getnotes/'+ phone )
            .then((items) => {
                    console.log(items.data.notes)
                    //for (i in items.data.notes){
                    //        items.data.notes[i][1]["note"] = items.data.notes[i][1]["note"].split()
                    // }
                    dispatch(fetchDataSuccess(items.data)); 
                    resolve()
                })
            // .catch((error) => {AsyncStorage.removeItem('jwt'); console.log(error)});
    })
}

export function fetchDataSuccess(items) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        items
    };
}


// post to https://healthnotes.herokuapp.com/1/addnote/:phoneNo/:patientID/:note
export function putData(phoneNo, patientID, note) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('putData ran with: https://healthnotes.herokuapp.com/1/addnote/' + phoneNo + '/' + patientID + '/' + note)
        axios.post('https://healthnotes.herokuapp.com/1/addnote/' + phoneNo + '/' + patientID + '/' + note, { 
            method: 'POST',
            headers: {
                'mode': 'no-cors',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }
          )
        .then((response) => {console.log(response.data); resolve()})
        .catch((error) => console.log(error));
    });
}


// ---------------------   AUTHENTICATION ACTIONS   --------------------------------------


// post to https://healthnotes.herokuapp.com/2/auth/9177043031
export function sendPhoneNumber(phone){
    return dispatch => new Promise((resolve, reject) => {
    axios.post('https://healthnotes.herokuapp.com/2/auth/'+ phone)
            .then((response) => {
                resolve(response.data)
                })
        })
}


// post to https://healthnotes.herokuapp.com/2/login/9177043031/8523
export function sendPIN(PIN, phoneNo) {
    return dispatch => new Promise((resolve, reject) => {        
        console.log('https://healthnotes.herokuapp.com/2/login/'+ phoneNo +'/'+ PIN)
        // AsyncStorage.setItem('jwt', 'token' ); resolve() // UNCOMMENT FOR OFFLINE MODE
        axios.post('https://healthnotes.herokuapp.com/2/login/'+  phoneNo +'/'+ PIN)
            .then((response) => {
                    if (response.data == false){ console.log('wrong'); resolve()}
                    else { AsyncStorage.setItem('jwt', 'token' ); }
                })
            .then(() =>  resolve() )         
    })
}


// post to https://healthnotes.herokuapp.com/2/register/9177043031/8523
export function register(phoneNo, PIN) {
    return dispatch => new Promise((resolve, reject) => {        
        console.log('https://healthnotes.herokuapp.com/2/register/'+ phoneNo +'/'+ PIN )
        axios.post('https://healthnotes.herokuapp.com/2/register/'+  phoneNo +'/'+ PIN )
            .then((response) => {
                    if (response.data.command === 'UPDATE'){ AsyncStorage.setItem('jwt', 'token' ); resolve() }
                    else{ console.log('register didnt work with status:' + response.data); resolve()}
                })         
    })
}

