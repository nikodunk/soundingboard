import { AsyncStorage } from 'react-native';
import axios from 'axios';



// get to https://healthnotes.herokuapp.com/1/getnotes/9177043031/
export function fetchData(phone) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('fetchData ran', phone)
        axios.get('https://healthnotes.herokuapp.com/1/getnotes/'+ phone )
            .then((items) => {
                    dispatch(fetchDataSuccess(items.data)); 
                    resolve(items.data)
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


// post to https://healthserve.herokuapp.com/2/toggledate/9177043031/2019-05-01
export function putData(date, phoneNo) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('putData ran with date: ' + date + ', phoneNo: ' + phoneNo)
        axios.post('https://healthserve.herokuapp.com/2/toggledate/' + phoneNo + '/' + date, { 
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



// get to https://healthserve.herokuapp.com/2/firstrun/9177043031
export function fetchFirstrun(phone) {
    return dispatch => new Promise((resolve, reject) => {
        axios.get('https://healthserve.herokuapp.com/2/firstrun/'+ phone )
            .then((items) => {
                    resolve(items.data)
                })
    })
}


// post to https://healthserve.herokuapp.com/2/firstrun/9177043031
export function setFirstrun(phone) {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('https://healthserve.herokuapp.com/2/firstrun/'+ phone + '/toggle' )
            .then((items) => {
                    resolve(items.data)
                })
    })
}




// post to https://healthserve.herokuapp.com/2/alterusergroup/9177043031/stanim2019
export function alterUsergroup(phone, usergroup) {
    return dispatch => new Promise((resolve, reject) => {
        
        axios.post('https://healthserve.herokuapp.com/2/alterusergroup/'+ phone + '/'+ usergroup )
            .then((items) => {
                    resolve(items.data)
                })
    })
}