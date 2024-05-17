import React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { AccountContext} from './Rutare';
import {useContext} from 'react';



const Login = () => {
  const {account, setAccount} = useContext(AccountContext);
  const [email, setEmail] = useState('');
  const [prenume, setPrenume] = useState('');
  const [password, setPassword] = useState ('');
  const [eroare, setEroare] = useState('');
  const [eroareLogare, setEroareLogare] = useState('');
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect (() => {console.log(account)}, [account])

  function obtinePrenumeLogat(uid) {
    console.log('functia apelata')
    let prenume;
    let payload = {uid} 
    fetch(`http://localhost:8000/login`, {method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'}})
            .then(r => r.text()).then(rr => {
              console.log(rr)
              console.log(uid)
              prenume = rr;
              setAccount({uid: uid, prenume: rr})
              navigate('/')
            })
            // setMesajPrenume('');
            // setMesajNume('');
            // setMesajEmail('');
            // setMesajNrRomania('');
            
            // setIsModalOpen(true);
    return prenume;    
    }

    
  return (
    <div id = 'divMare'>
        <div id = 'divTop'>
            <p id = 'pCreareCont'>Login</p>
        </div>


        <div id = 'divForms'> 
            <p id = 'pEroare'>{eroare}</p>
            <p id = 'credentialeGresite'>{eroareLogare}</p>
            <fieldset className = 'fieldsetRegister'>
                <legend>E-mail</legend>
                <input 
                className = "styleInputAccount" 
                placeholder = "E-mail"
                onChange = {(e) => {setEmail(e.target.value)}}>
                </input>
            </fieldset>
            
            
            <fieldset className = 'fieldsetRegister'>
                <legend>Parola</legend>
                <input 
                type = 'password' 
                className = "styleInputAccount" 
                placeholder = "Parola"
                onChange = {(e) => {setPassword(e.target.value)}}  
                ></input>
            </fieldset>
            

            <button 
                id = 'butonContinua'
                onClick = {() => {
                if (!regexEmail.test(email)) {
                    setEroare('Va rugam sa completati adresa de email si sa va asigurati ca este valida')
                    return
                }
                if (password.length < 6) {
                    setEroare('Parola trebuie sa contina cel putin 6 caractere')
                    return
                }
                signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Signed in 
                  const user = userCredential.user;

                  console.log(user)
                  
                  let uid = user.uid
                  // ...

                   obtinePrenumeLogat(uid);     
                  
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log(error)
                  if (errorCode == 'auth/invalid-credential') setEroareLogare('Credentiale gresite')
                  else setEroareLogare('Ne pare rau! Incercati mai tarziu')
                });

      }}
                >CONTINUA</button>
            {/* <div 
              className = 'pInstructiuni'
              onClick = {() => {navigate('/login')}}  
            >Ai deja cont? Intra in contul tau!</div>    */}

        </div>
        

    </div>
  )
}


export default Login