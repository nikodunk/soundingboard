import { AsyncStorage } from 'react-native';
import axios from 'axios';



// get to https://healthnotes.herokuapp.com/1/getnotes/9177043031/
export function fetchData(patientID) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('fetchData ran', phone)
        
        AsyncStorage.getItem(patientID).then((items) => {
            // console.log(items.data.notes)
                    // for (i in items.data.notes){
                    //        items.data.notes[i][1]["note"] = items.data.notes[i][1]["note"].split('#')
                    //        console.log(i + items.data.notes[i][1]["note"])
                    // }
                    dispatch(fetchDataSuccess(items.data)); 
                    resolve()
          })
    })
}

export function fetchDataSuccess(items) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        items
    };
}


// post to https://healthnotes.herokuapp.com/1/addnote/:phoneNo/:patientID/:note
export function putData(phoneNo, patientID, note0, note1, note2, note3) {
    return dispatch => new Promise((resolve, reject) => {
        // console.log('putData ran with: https://healthnotes.herokuapp.com/1/addnote/' + phoneNo + '/' + patientID + '/' + note0 + '#' + note1 + '#' + note2 + '#' + note3)
        AsyncStorage.setItem(patientID, note0.toString() + '#' + note1.toString() + '#' + note2.toString() + '#' + note3.toString() );
            // .then((response) => {console.log(response.data); resolve()})
            // .catch((error) => console.log(error));
    });
}

