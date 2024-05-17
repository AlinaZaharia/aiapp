
import './App.css';
import { Avatar, Input, Tooltip, Button, Popover} from 'antd';
import {SendOutlined, FormOutlined, OpenAIOutlined, UserOutlined, MessageOutlined, SettingFilled, SyncOutlined} from '@ant-design/icons';
import {useState, useEffect} from 'react';
import { BsBookmarkStar } from "react-icons/bs";
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { AccountContext} from './Rutare';
import {useContext} from 'react';
import { obtinePrenumeLogat } from './diverse';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { CiTrash } from "react-icons/ci";
import { isPresetStatusColor } from 'antd/es/_util/colors';





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
  const [idConversatie, setIdConversatie] = useState('');
  const [arrIstoricConversatii, setArrIstoricConversatii] = useState([]);
  const [finalStreamedResponse, setFinalStreamedResponse] = useState('');
  
  let varAvatar = <Avatar 
  style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{account.prenume}</Avatar>

  let varAI = <OpenAIOutlined />


  function aranjeazaConversatie (exp, data, textMesaj) {
    let avatar;
    if (exp == 'client') {
      exp = 'You'
      avatar = varAvatar}
    else {
      exp = 'chat-ai'
      avatar = varAI};

    return (
      <div className={`flex items-start gap-2.5 ${(exp == 'You') ? 'aliniereDreapta' : ''}`}>
         {avatar}
         <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div className="flex space-x-2 rtl:space-x-reverse alCorecta">
               <span className="text-sm font-semibold text-gray-900 dark:text-white">{exp}</span>
               <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{data}</span>
            </div>
            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{textMesaj}</p>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
         </div>
         
         
      </div>
      )
  }
  
  // useEffect(() => {
  //   console.log(finalStreamedResponse);
   
  //   if (finalStreamedResponse.length == 1) {
      
  //     let obiect_arrConversatie = {exp: 'AI', text: finalStreamedResponse[0]}
  //     console.log(obiect_arrConversatie)
      
  //   }
  //   else {
  //     let text = ''
  //     for (let chunk of finalStreamedResponse){
  //       text += chunk
  //     }
  //     console.log('super', text)
  //     // obiect_arrConversatie.text 
    
  //   }
         
    
  // }, [finalStreamedResponse])

  useEffect(() => {
    console.log(finalStreamedResponse)
    setArrConversatie([...arrConversatie, {exp: 'AI', text: finalStreamedResponse}])

  }, [finalStreamedResponse])
  
  useEffect(() => {
    // console.log(arrConversatie)
    if (arrConversatie.length != 0 && arrConversatie[arrConversatie.length - 1].exp == 'client'){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append('responseType', 'stream')

      var raw = JSON.stringify({
        "key": arrConversatie[arrConversatie.length - 1].text
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
      };
      fetch("http://127.0.0.1:5000/intrebare", requestOptions)
      // .then((response) => response.text())
      
      .then(async response => {
        // console.log(response)
        const reader = response.body.getReader()
        let decoder = new TextDecoder()

        let exitWhile = 0;
        // incercare cu string
        let text = ''
        function proceseazaChunk ({done, value}){
          console.log(text)
          // setFinalStreamedResponse(text)
          if (done == true) return
          reader.read().then(({done, value}) => proceseazaChunk({done, value}))
        }

        await reader.read().then(({done, value}) => proceseazaChunk({done, value}))
        console.log(finalStreamedResponse)
        // function proceseazaChunk ({done, value}){
        //   setFinalStreamedResponse([...finalStreamedResponse, decoder.decode(value, {stream: true})]);

        //   if (done == true) return
        //    reader.read().then(({done, value}) => proceseazaChunk({done, value}))
        // }


        // await reader.read().then(({done, value}) => proceseazaChunk({done, value}))
        
        // console.log(finalStreamedResponse)        
        
        
         
        // if (arrConversatie.length == 1) {
        //   // alert(result)
        
        // }
        // setArrConversatie([...arrConversatie, {exp: 'AI', text: result}]);
        // let obiect_arrConversatie = {};
        // obiect_arrConversatie.exp = "AI";
        // obiect_arrConversatie.text = result;
        // obiect_arrConversatie.idConversatie = idConversatie;
        // insertMesaj(obiect_arrConversatie)
        // let obiectIstoricConv = {idconversatie: idConversatie, mesajfinal: result.substring(0, 30) + '...'}
        // let arrIntIstoricConversatii = arrIstoricConversatii.filter(item => item.idconversatie != idConversatie)
        // console.log(arrIntIstoricConversatii)
        // setArrIstoricConversatii([...arrIntIstoricConversatii, obiectIstoricConv])

      })
      .catch(error => console.log('error', error))
    }
    
  }, [arrConversatie]
  )

  useEffect(() => {
    fetch(`http://localhost:8000/istoricConversatii?uid=${account.uid}`)
      .then(r => r.json())
      .then(rr => {
        // console.log(rr)
        setArrIstoricConversatii(rr)
      })
    
      insereazaConvNoua(account.uid)
  }, [account])

  function insereazaConvNoua (uid) {
    let obiectConvNoua = {};
    // let myuuid = uuidv4();
    obiectConvNoua.uid = account.uid;
    obiectConvNoua.idConversatie = uuidv4();
    // console.log('Your UUID is: ' + myuuid);
    // console.log(account)
    if (account.uid) fetch('http://localhost:8000/conversatie', {method: "POST", body: JSON.stringify(obiectConvNoua), headers: {'Content-Type': 'application/json'}})
      .then(r => r.text())
      .then((rr) => {
        // console.log(rr)
        setIdConversatie(obiectConvNoua.idConversatie)
        let obInt = {idconversatie: obiectConvNoua.idConversatie, mesajfinal: "New conversation"} 
        setArrIstoricConversatii([...arrIstoricConversatii, obInt])


      });

  }
 
  
  function insertMesaj (obj) {
    fetch('http://localhost:8000/mesaje', {method: 'POST', body: JSON.stringify(obj), headers: {'Content-Type': 'application/json'}})
      .then(r => r.text())
      // .then((rr) => console.log(rr))
    

  }

  
  function trimiteMesaj () {
    let obiect_arrConversatie = {};
    obiect_arrConversatie.exp = 'client';
    obiect_arrConversatie.text = mesajInput;
    obiect_arrConversatie.idConversatie = idConversatie;
    // console.log(mesajInput);
    setArrConversatie([...arrConversatie, obiect_arrConversatie]);
    insertMesaj(obiect_arrConversatie);


    // fetch(`http://127.0.0.1:5000/intrebare`, {method: 'POST', body: JSON.stringify({mesaj: mesajInput}), headers: {'Content-Type': 'application/json'}})
    //   .then((r) => r.text())
    //   .then(rr => {
    //     console.log(rr)
    //     // setMesajAfisat(rr)
       
    //   })

    // axios({
    //   method: 'post',
    //   url: 'http://127.0.0.1:5000/intrebare',
    //   data: {
    //     mesaj: mesajInput,
    //   },
    //   headers: {
    //     // Overwrite Axios's automatically set Content-Type
    //     'Content-Type': 'application/json'
    //   }
    // });


  //     const json = JSON.stringify({ });
  //     const res = axios.post('http://localhost:5000/intrebare', {key: mesajInput}, {
  //   headers: {
  //     // Overwrite Axios's automatically set Content-Type
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   }
    
  // }).then().catch((e) => console.log(e));
 
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
        <div id = 'divNewChat' onClick = {() => {
            // console.log('executare')
            insereazaConvNoua(account.uid)
            setArrConversatie([])
          }}>
          <p ><OpenAIOutlined /></p>
          <p >New chat</p>
          <p>            
            <Tooltip placement="right" title={text}>
              <FormOutlined />
            </Tooltip>
          </p>
        </div>
          
        <div>
          <p style = {{textAlign: 'center', paddingTop: '40px'}}>2024</p>
        </div>
        <div id = 'continutIstoric'>
          {arrIstoricConversatii.map((item) => 
            <div
              onClick = {() => {
                // console.log(item.idconversatie)
                fetch(`http://localhost:8000/mesaje?idconversatie=${item.idconversatie}`)
                  .then(r => r.json())
                  .then(rr => {
                    // console.log(rr)
                    setArrConversatie(rr)
                  })
              }}
              className = 'divItemIstoric'>{item.mesajfinal}<CiTrash onClick = {() => {
                fetch(`http://localhost:8000/conversatie/${item.idconversatie}`, {method: 'DELETE'}).then(r => {
                  // console.log(r)
                  if (r.status == 204) {
                    let arrIntConversatii = [...arrIstoricConversatii]
                    arrIntConversatii = arrIntConversatii.filter((element) => element.idconversatie != item.idconversatie)
                    setArrIstoricConversatii(arrIntConversatii)

                  }
                })
              }}/>
            </div>)}
        </div>

      </div>
      <div id = 'divPrincipal'>
        <div id = 'divUtilizator'></div>
        <div id = 'divContinut'>
          {arrConversatie.length != 0 ? (arrConversatie.map ((item) => {
              // console.log(arrConversatie)
             let objDate = new Date (item.data)
             if (!item.data) objDate = 'now'
            //  console.log(item.data)
            //  console.log(objDate)   
            //  console.log(item.textmesaj)
                      
             return aranjeazaConversatie(item.exp, item.text, objDate.toLocaleString('ro-Ro').slice(0, 17))
            
            })) : null}
          
          <p id = 'parSync'><SyncOutlined spin style={{ fontSize: '16px', color: '#08c' }} className = {arrConversatie[arrConversatie.length - 1]?.exp == 'client' ? 'iconAfisat' : 'iconNeafisat'}/></p>
          

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
            {idConversatie ? <SendOutlined 
                style = {{paddingTop: '10px'}} 
                onClick = {() => {
                  if (mesajInput == '') return
                  trimiteMesaj()
                  setMesajInput('')
                }}      
            /> : <SyncOutlined spin></SyncOutlined>}  
            
              
            
            </Tooltip>
          </p>
         
        </div>
      </div>
    </div>
  );
}

export default App;
