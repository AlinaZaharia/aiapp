
import './App.css';
import { Avatar, Input, Tooltip, Button, Popover} from 'antd';
import {SendOutlined, FormOutlined, OpenAIOutlined, UserOutlined, MessageOutlined, SettingFilled} from '@ant-design/icons';
import {useState, useEffect} from 'react';
import { BsBookmarkStar } from "react-icons/bs";
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { AccountContext} from './Rutare';
import {useContext} from 'react';
import { obtinePrenumeLogat } from './diverse';




function App() {
  const {account, setAccount} = useContext(AccountContext);
 
  const auth = getAuth();
  const content = (
    <div>
      <p onClick = {() => {setAccount({})
              
              signOut(auth).then(() => {
                // Sign-out successful.
              }).catch((error) => {
                console.log(error)
                // An error happened.
              })}}>Delogare</p>
    </div>
  );

  
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     let prenume
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/auth.user
  //       const uid = user.uid;
  //       console.log(user.uid)
  //       prenume = account.prenume
  //       console.log(prenume)        
  //       // obtineInitialeClient(email).then(initialeLogat => setAccount({email, initialeLogat, uid}))
  //       // ...
  //     } else {
  //       // setAccount({});
  //       // User is signed out
  //       // ...
  //     }
  //    })
  // }, [])

  const text = <span>New chat</span>;
  // const buttonWidth = 80;
  const [mesajInput, setMesajInput] = useState('');
  const [arrConversatie, setArrConversatie] = useState([]);
  const [mesajAfisat, setMesajAfisat] = useState('');
   

  function trimiteMesaj () {
    arrConversatie.push(mesajInput)
    
    fetch(`http://localhost:8000/test`, {method: 'POST', body: JSON.stringify({mesaj: mesajInput}), headers: {'Content-Type': 'application/json'}})
      .then((r) => r.text())
      .then(rr => {
        console.log(rr)
        // setMesajAfisat(rr)
       
      })
  }

  
  
  return (
    <div className="App">
      <div id = 'divNavbar'>
        <div id = 'divIcons'> 
        {account.uid ? <Popover placement="right" content={content}>
       
          <Avatar 
            style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
            
        >{account.prenume}</Avatar>
        </Popover> : <UserOutlined />}
              
        <MessageOutlined />
        <SettingFilled />
        <BsBookmarkStar />
        </div>
      </div>
      <div id = 'divIstoric'>
        <div id = 'divNewChat'>
          <p ><OpenAIOutlined /></p>
          <p>New chat</p>
          <p>            
            <Tooltip placement="right" title={text}>
              <FormOutlined />
            </Tooltip>
          </p>
        </div>
          
        <div>
          <p style = {{textAlign: 'center', paddingTop: '40px'}}>2024</p>
        </div>
      </div>
      <div id = 'divPrincipal'>
        <div id = 'divUtilizator'></div>
        <div id = 'divContinut'>
          {arrConversatie.length != 0 ? arrConversatie.map ((item) => <p>{item}</p>) : null}
          

        </div>
        <div id = 'divMesaj'>
        
        
          <Input 
            id = 'inputMesaj' style = {{width: '70%', height: '45px', border: 'none', marginLeft: '60px', marginRight: '70px'}} 
            placeholder = 'Type your message...'
            value = {mesajInput}
            onChange = {(e) => setMesajInput(e.target.value)}
            onPressEnter = {(e) => {
              trimiteMesaj()
              setMesajInput('')
            }}
          />
          <p id = 'parSend'>
            
            <Tooltip title="Send message">
              <SendOutlined 
                style = {{paddingTop: '10px'}} 
                onClick = {() => {
                  trimiteMesaj()
                  setMesajInput('')
                }}      
            />
            
            </Tooltip>
          </p>
         
        </div>
      </div>
    </div>
  );
}

export default App;
