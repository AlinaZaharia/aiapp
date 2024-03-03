import { onAuthStateChanged } from "firebase/auth";
import {getAuth} from "firebase/auth";
import {app, auth} from './firebase'


function logare (cb) {
    
    let prenume;
    let dateAccount = {};
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log(user.uid)
          let payload = {uid} 
          fetch(`http://localhost:8000/login`, {method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'}})
                  .then(r => r.text()).then(rr => {
                    console.log(rr)
                    console.log(uid)
                    prenume = rr;
                  dateAccount = {uid: uid, prenume: prenume};
                    cb(dateAccount)
                  })
          
        } else {
          // setAccount({});
          // User is signed out
          // ...
        }})
    
            
     
    }

    export {logare, onAuthStateChanged};