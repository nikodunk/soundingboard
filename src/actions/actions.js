import { AsyncStorage } from 'react-native';
import axios from 'axios';



// get to https://healthnotes.herokuapp.com/1/getnotes/9177043031/
export function fetchData(phone) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('fetchData ran', phone)
        axios.get('https://healthnotes.herokuapp.com/1/getnotes/'+ phone )
            .then((items) => {
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


// post to https://healthserve.herokuapp.com/1/addnote/:phoneNo/:patientID/:note
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

