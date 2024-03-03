import React from 'react';
import {useState} from 'react';
import {auth} from './firebase.js';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {Modal } from 'antd';



const Register = () => {
    const [email, setEmail] = useState('');
    const [prenume, setPrenume] = useState('');
    const [password, setPassword] = useState ('');
    const [eroare, setEroare] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const navigate = useNavigate();
    let uid = '';


    function trimiteInBazaDeDate () {
        console.log(email, password.length)
        if ((password.length >= 6) && (prenume != '')) {
            
            let obiectDate = {prenume: prenume.trim(), email: email.trim(), uid: uid}
            console.log(obiectDate);
            fetch(`http://localhost:8000/register`, {method: 'POST', body: JSON.stringify(obiectDate), headers: {'Content-Type': 'application/json'}})
            .then(r => r.text()).then(rr => {
                console.log(rr)
                if (rr == 'Inregistrare reusita') {
                    setIsModalOpen(true)
                    success()
                }
            })
           
        }

        else console.log("Pica treaba")
    }


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
    
      const handleCancel = () => {
        setIsModalOpen(false);
      } 


  return (
    <div id = 'divMare'>
        <div id = 'divTop'>
            <p id = 'pCreareCont'>Creeaza cont pentru a accesa chat-ai</p>
        </div>


        <div id = 'divForms'> 
            <p id = 'pEroare'>{eroare}</p>
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
            <fieldset className = 'fieldsetRegister'>
                <legend>Prenume</legend>
                <input 
                className = "styleInputAccount" 
                placeholder = "Prenume"
                onChange = {(e) => {setPrenume(e.target.value)}}>
                </input>
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
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    console.log(userCredential.user.uid);
                    const user = userCredential.user;
                    uid = userCredential.user.uid
                    trimiteInBazaDeDate()
                                
                    // setEroare('');
                    
                    // setIsModalOpen(true)
                    // success()
                    // ....
                    })
                    .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error.code)
                    if (error.code == 'auth/weak-password') setEroare('Parola trebuie sa contina cel putin 6 caractere')
                    if (error.code == 'auth/missing-password') setEroare('Introduceti parola')
                    if (error.code == 'auth/invalid-email') setEroare ('Introduceti un email valid')

                    // ..
            });
                // setPasRandare(2)
                }}
                >CONTINUA</button>
            <div 
              className = 'pInstructiuni'
              onClick = {() => {navigate('/login')}}  
            >Ai deja cont? Intra in contul tau!</div>   

        </div>
        {/* {(pasRandare == 2) && <div id = 'divForms'>
        <p id = 'pEroare'>{eroare}</p>
            <fieldset className = 'fieldsetRegister'>
                <legend>Prenume</legend>
                <input 
                className = "styleInputAccount" 
                placeholder = "Prenume"
                onChange = {(e) => {setEmail(e.target.value)}}>
                </input>
            </fieldset>
            
            </div>} */}

    </div>
  )
}

export default Register