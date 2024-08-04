import React from 'react';
import {useEffect, useState} from 'react';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from './firebase.js';
import {Modal } from 'antd';
import { useNavigate } from "react-router-dom";


const Welcome = () => {
  const [mesajEroare, setMesajEroare] = useState('');
  const [eroare, setEroare] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  let uid = '';
  

  const success = () => {
    Modal.success({
        content: <>
            <p>Crearea contului s-a efectuat cu succes.</p>
            <p>Vei primi in scurt timp un e-mail de confirmare.</p>
        </>,
        okText: 'Pagina principala',
        onOk: () => {navigate('/')}
    });
  };

 
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const valKey = urlParams.get('valKey')
      console.log(valKey)
      let objValkey = {valKey: valKey}
        fetch('http://localhost:8000/keyValidation', {method: 'POST', body: JSON.stringify(objValkey), headers: {'Content-Type': 'application/json'}})
        .then(r => r.json()).then(r => {
          // deschide/nu deschide cont

          console.log(r)
          if (r.email && r.password)  {

            createUserWithEmailAndPassword(auth, r.email, r.password)
                    .then((userCredential) => {
                        // Signed up 
                        console.log(userCredential.user.uid);
                        const user = userCredential.user;
                        uid = userCredential.user.uid;
                        let obiectQuery = {};
                        obiectQuery.uid = uid;
                        obiectQuery.email = r.email
                        // trimiteInBazaDeDate();
                        fetch('http://localhost:8000/inserareUID', {method: 'POST', body: JSON.stringify(obiectQuery), headers: {'Content-Type': 'application/json'}})            
                        setEroare('');
                        
                        setIsModalOpen(true);
                        success();
                        // ....
                        })
                    .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error.code);
                    if (error.code == 'auth/weak-password') setEroare('Parola trebuie sa contina cel putin 6 caractere')
                    if (error.code == 'auth/missing-password') setEroare('Introduceti parola')
                    if (error.code == 'auth/invalid-email') setEroare ('Introduceti un email valid')

                    // ..
                    });
          }
          else {
            setMesajEroare('Ne pare rau! A intervenit o eroare.')
          }


        })

    }, [])

  return (
    <div>{mesajEroare}</div>
  )
}

export default Welcome