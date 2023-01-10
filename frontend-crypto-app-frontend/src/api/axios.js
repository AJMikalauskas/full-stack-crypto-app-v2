import axios from 'axios';
//let BASE_URL = 'http://localhost:3500'; //--> 'https://crypto-app-demo-test.herokuapp.com/';
 //BASE_URL = 'https://crypto-app-demo-test.herokuapp.com/' ;
let BASE_URL = 'https://tame-crow-loincloth.cyclic.app/';

export default axios.create({
    baseURL: BASE_URL,
    mode: "no-cors"
    // headers: {
    //     'Access-Control-Allow-Origin' : '*'
    // }
})

// axios private to have interceptors, to work with JWT to refresh a token if our current accessToken or refreshToken is expired.
    // withCredentials is for the refreshToken cookie
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Content-Type': 'application/json', 
     //   'Access-Control-Allow-Origin' : '*'
    },
    withCredentials: true
})