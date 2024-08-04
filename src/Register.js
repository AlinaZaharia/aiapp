import React from 'react';
import {useState} from 'react';
import { default as SU} from '../src/web_light_rd_SU.svg';
import {Modal } from 'antd';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import {v4 as uuidv4} from 'uuid';
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Alert, Button, Space } from 'antd';






const Register = () => {
    const [email, setEmail] = useState('');
    const [prenume, setPrenume] = useState('');
    const [password, setPassword] = useState ('');
    const [eroare, setEroare] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const navigate = useNavigate();
    let uid = '';
    const [isSucces, setIsSucces] = useState(false);
    const [isErrorDuplicateEmail, setIsErrorDuplicateEmail] = useState(false);
    const provider = new GoogleAuthProvider();

    
    // const actionCodeSettings = {
    //     // URL you want to redirect back to. The domain (www.example.com) for this
    //     // URL must be in the authorized domains list in the Firebase Console.
    //     url: 'https://localhost:3000/welcome',
    //     // This must be true.
    //     handleCodeInApp: true,
    // };

    

    // const auth = getAuth();
    // sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // // .then(() => {
    // //     // The link was successfully sent. Inform the user.
    // //     // Save the email locally so you don't need to ask the user for it again
    // //     // if they open the link on the same device.
    // //     window.localStorage.setItem('emailForSignIn', email);
    // //     // ...
    // // })
    // .catch((error) => {
    //     console.log(error)
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ...
    // });



    // function trimiteInBazaDeDate () {
    //     console.log(email, password.length)
    //     if ((password.length >= 6) && (prenume != '')) {
            
    //         let obiectDate = {prenume: prenume.trim(), email: email.trim(), uid: uid}
    //         console.log(obiectDate);
    //         fetch(`http://localhost:8000/register`, {method: 'POST', body: JSON.stringify(obiectDate), headers: {'Content-Type': 'application/json'}})
    //         .then(r => r.text()).then(rr => {
    //             console.log(rr)
    //             if (rr == 'Inregistrare reusita') {
    //                 setIsModalOpen(true)
    //                 success()
    //             }
    //         })
           
    //     }

    //     else console.log("Pica treaba")
    // }

    const auth = getAuth();

    


    const success = () => {
        Modal.success({
            content: <>
                <p>Crearea contului s-a efectuat cu succes.</p>
               {/* <p>Vei primi in scurt timp un e-mail de confirmare.</p> */}
            </>,
            okText: 'Pagina principala',
            onOk: () => {navigate('/')}
        });
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      } 


  return (
    <>
        {isErrorDuplicateEmail ? <div id = 'divTransparent'></div> : <></>}
        {!isSucces ? <div id = 'divMare'>
            <div id = 'divTop'>
                
            {isErrorDuplicateEmail ? <div id = 'divAlert'><Alert
                message="Eroare"
                description={<div>Contul deja exista. <p><button id = 'butonSignIn'>Mergi la Sign-in</button></p></div>}
                type="error"
                closable
                showIcon
            /></div> : <></>} 
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

                        let obiectValEmail = {};
                        obiectValEmail.validationKey = uuidv4();
                        obiectValEmail.email = email;
                        obiectValEmail.prenume = prenume;
                        obiectValEmail.password = password;
                        fetch(`http://localhost:8000/emailsValidation`, {method: 'POST', body: JSON.stringify(obiectValEmail), headers: {'Content-Type': 'application/json'}})
                        .then(r => {
                            console.log(r)
                            if (r.status == 200){
                                setIsSucces(true);
                            }
                        })
                        // createUserWithEmailAndPassword(auth, email, password)
                        // .then((userCredential) => {
                        //     // Signed up 
                        //     console.log(userCredential.user.uid);
                        //     const user = userCredential.user;
                        //     uid = userCredential.user.uid
                        //     trimiteInBazaDeDate()
                                        
                            // setEroare('');
                            
                            // setIsModalOpen(true)
                            // success()
                            // ....
                            // })
                        // .catch((error) => {
                        // const errorCode = error.code;
                        // const errorMessage = error.message;
                        // console.log(error.code)
                        // if (error.code == 'auth/weak-password') setEroare('Parola trebuie sa contina cel putin 6 caractere')
                        // if (error.code == 'auth/missing-password') setEroare('Introduceti parola')
                        // if (error.code == 'auth/invalid-email') setEroare ('Introduceti un email valid')

                        // // ..
                        // });
                        // setPasRandare(2)
                    }}
                    >CONTINUA</button>
                <div 
                className = 'pInstructiuni'
                onClick = {() => {navigate('/login')}}  
                >Ai deja cont? Intra in contul tau!</div>   
                <img onClick = {() => {
                    signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        console.log('credential: ', credential, 'result: ', result)
                        let obiectUsers = {};
                        obiectUsers.displayName = result.user.displayName;
                        obiectUsers.email = result.user.email;
                        obiectUsers.uid = result.user.uid;
                        fetch('http://localhost:8000/register', {method: 'POST', body: JSON.stringify(obiectUsers), headers: {'Content-Type': 'application/json'}})
                        .then(r => {
                            if (r.status == 409) {
                                setIsErrorDuplicateEmail(true);

                            }
                        })

                        // const token = credential.accessToken;
                        // The signed-in user info.
                        // const user = result.user;
                        // IdP data available using getAdditionalUserInfo(result)
                        // ...
                    }).catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.customData.email;
                        // The AuthCredential type that was used.
                        const credential = GoogleAuthProvider.credentialFromError(error);
                        // ...
                    })
                }} src={SU} />
               

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

        </div> :
        <div id = 'divSucces'> 
         <h2>Succes! Vei gasi in inbox un link pentru validarea email-ului.</h2>       
        </div> }
    </>
  )
}

export default Register