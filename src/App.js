
import './App.css';
import { Avatar, Input, Tooltip, Button, Popover} from 'antd';
import {SendOutlined, FormOutlined, OpenAIOutlined, UserOutlined, MessageOutlined, SettingFilled, SyncOutlined} from '@ant-design/icons';
import {useState, useEffect, useRef} from 'react';
import { BsBookmarkStar } from "react-icons/bs";
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { AccountContext} from './Rutare';
import {useContext} from 'react';
// import { obtinePrenumeLogat } from './diverse';
import {v4 as uuidv4} from 'uuid';
// import { isPresetStatusColor } from 'antd/es/_util/colors';
import DotsDD from './components/DotsDD';
import {useParams} from 'react-router-dom';



function App() {
  const {account, setAccount} = useContext(AccountContext);
  const [titluConv, setTitluConv] = useState('');
  let {idConvURL} = useParams();
  // console.log(idConvURL)

  useEffect(() => {
    console.log('ID-ul din URL:', idConvURL);
    loadConv(idConvURL);
  }, []);


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

  
  const scrollableDivRef = useRef(null);
  // console.log(scrollableDivRef)

  function scroll () {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
  }
  }

  
  
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
  const [mesajInitial, setMesajInitial] = useState('')
  const [mesajInput, setMesajInput] = useState('');
  const [arrConversatie, setArrConversatie] = useState([]);
  const [mesajAfisat, setMesajAfisat] = useState('');
  const [idConversatie, setIdConversatie] = useState('');
  const [idClickedConv, setIdClickedConv] = useState('');
  const [arrIstoricConversatii, setArrIstoricConversatii] = useState([]);
  const [finalStreamedResponse, setFinalStreamedResponse] = useState('');
  const [isInTrimitere, setIsInTrimitere] = useState(false);

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

  useEffect(() => {console.log(idClickedConv)}, [idClickedConv])
  
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
    // console.log(finalStreamedResponse)
    // setArrConversatie([...arrConversatie, {exp: 'AI', text: finalStreamedResponse}])

  }, [finalStreamedResponse])
  
  useEffect(() => {
    // console.log(arrConversatie)
    // console.log(idConversatie)
    if (arrConversatie.length != 0 && arrConversatie[arrConversatie.length - 1].exp == 'client'){
      if (arrConversatie.length == 1) {
        scroll();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('responseType', 'stream')

        var raw = JSON.stringify({
          "key": arrConversatie[arrConversatie.length - 1].text,
          "titlu": true
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw
        };
        
        fetch("http://127.0.0.1:5000/intrebare", requestOptions)
        .then(async response => {
          // console.log('BBBBBBB', idConversatie)
          // alert(response)
          const reader = response.body.getReader()
          let decoder = new TextDecoder()
  
          let exitWhile = 0;
          // incercare cu string
          let result = ''
          function proceseazaChunk ({done, value}){
            let obiect_arrConversatie = {};
            result += decoder.decode(value, {stream: true})
            // console.log(result)
            let arrCurat = result.split('[ss]').filter((chunk) => chunk != '')
            console.log(arrCurat)
            // let newArrConversatie = []
            // if (arrCurat.length == 1) {
            //   setArrConversatie([...arrConversatie, {exp: 'AI', text: arrCurat[0]}])
              
                //   scroll() 
            // }
            // else {
            //   for (let obiect of arrConversatie){
            //     newArrConversatie.push(obiect)
            //     console.log(newArrConversatie)
            //   }
            //   let mesajInProgress = ''
            //   for (let msg of arrCurat) mesajInProgress += msg
            //   setArrConversatie([...newArrConversatie, {exp: 'AI', text: mesajInProgress}])
              
            //   obiect_arrConversatie.exp = "AI";
            //   obiect_arrConversatie.text = mesajInProgress;
            //   obiect_arrConversatie.idConversatie = idConversatie;
            //   let obiectIstoricConv = {idconversatie: idConversatie, mesajfinal: result.replaceAll('[ss]', '').substring(0, 20) + '...'}
            //   let arrIntIstoricConversatii = arrIstoricConversatii.filter(item => item.idconversatie != idConversatie)
            //   // console.log(arrIntIstoricConversatii)
            //   // console.log(obiectIstoricConv)
            //   setArrIstoricConversatii([...arrIntIstoricConversatii, obiectIstoricConv])
         
            // }
              console.log(arrCurat)
             
           
            if (done == true) {
              setIsInTrimitere(false)
              // console.log(result)
              let titlu = result.replaceAll('[ss]', '').replaceAll('"', '');
              console.log(titlu)
              setTitluConv(titlu);
              let obiectTitlu = {};
              obiectTitlu.idconversatie = idConversatie;
              obiectTitlu.titlu = titlu;
              fetch('http://localhost:8000/inserareTitluConv', {method: 'PUT', body: JSON.stringify(obiectTitlu), headers: {"Content-Type": "application/json"}})
              

              
              
              return
            }
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
        
      }
      scroll();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append('responseType', 'stream')

      var raw = JSON.stringify({
        "key": arrConversatie[arrConversatie.length - 1].text,
        "titlu": false
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
      };
      
      fetch("http://127.0.0.1:5000/intrebare", requestOptions)
      // .then((response) => response.text())
      
      .then(async response => {
        // console.log('BBBBBBB', idConversatie)
        // alert(response)
        const reader = response.body.getReader()
        let decoder = new TextDecoder()

        let exitWhile = 0;
        // incercare cu string
        let result = ''
        function proceseazaChunk ({done, value}){
          let obiect_arrConversatie = {};
          result += decoder.decode(value, {stream: true})
          // console.log(result)
          let arrCurat = result.split('[ss]').filter((chunk) => chunk != '')
          console.log(arrCurat)
          let newArrConversatie = []
          if (arrCurat.length == 1) {
            setArrConversatie([...arrConversatie, {exp: 'AI', text: arrCurat[0]}])
            
            
          }
          else {
            for (let obiect of arrConversatie){
              newArrConversatie.push(obiect)
              console.log(newArrConversatie)
            }
            let mesajInProgress = ''
            for (let msg of arrCurat) mesajInProgress += msg
            setArrConversatie([...newArrConversatie, {exp: 'AI', text: mesajInProgress}])
            
            obiect_arrConversatie.exp = "AI";
            obiect_arrConversatie.text = mesajInProgress;
            obiect_arrConversatie.idConversatie = idConversatie;
            let obiectIstoricConv = {idconversatie: idConversatie, mesajfinal: result.replaceAll('[ss]', '').substring(0, 20) + '...'}
            let arrIntIstoricConversatii = arrIstoricConversatii.filter(item => item.idconversatie != idConversatie)
            // console.log(arrIntIstoricConversatii)
            // console.log(obiectIstoricConv)
            setArrIstoricConversatii([...arrIntIstoricConversatii, obiectIstoricConv])
            scroll()
          }
            console.log(arrCurat)
           
         
          if (done == true) {
            setIsInTrimitere(false)
            insertMesaj(obiect_arrConversatie)
            return
          }
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
    if (!account.uid) return
    fetch(`http://localhost:8000/istoricConversatii?uid=${account.uid}`)
      .then(r => r.json())
      .then(rr => {
        // console.log('Obiect cu fav:', rr)
        setArrIstoricConversatii(rr)

      })
      setMesajInitial('Pentru a-mi adresa o intrebare da click pe New Chat')
      // insereazaConvNoua(account.uid)
  }, [account])

  function loadConv (idconv) {
    fetch(`http://localhost:8000/mesaje?idconversatie=${idconv}`)
                  .then(r => r.json())
                  .then(rr => {
                    console.log('ObiectMesajeSiTitlu', rr)
                    setArrConversatie(rr.mesaje)
                    setTitluConv(rr.titlu)
                  })
  }
  let simpleIDConv = '';

  function insereazaConvNoua (uid) {
    let obiectConvNoua = {};
    // let myuuid = uuidv4();
    obiectConvNoua.uid = account.uid;
    obiectConvNoua.idConversatie = uuidv4();
    simpleIDConv = obiectConvNoua.idConversatie
    // console.log('Your UUID is: ' + myuuid);
    // console.log(account)
    if (account.uid) fetch('http://localhost:8000/conversatie', {method: "POST", body: JSON.stringify(obiectConvNoua), headers: {'Content-Type': 'application/json'}})
      .then(r => r.text())
      .then((rr) => {
        // console.log(rr)
        let obInt = {idconversatie: obiectConvNoua.idConversatie, mesajfinal: "New conversation"}
        
        setIdConversatie(obiectConvNoua.idConversatie)
        // setIdClickedConv(obiectConvNoua.idConversatie)
        setArrIstoricConversatii([...arrIstoricConversatii, obInt])


      });
      return simpleIDConv
  }
  
  

  function insertMesaj (obj) {
    fetch('http://localhost:8000/mesaje', {method: 'POST', body: JSON.stringify(obj), headers: {'Content-Type': 'application/json'}})
      .then(r => r.text())
      // .then((rr) => console.log(rr))
    

  }

  
  function trimiteMesaj (id) {
    let obiect_arrConversatie = {};
    obiect_arrConversatie.exp = 'client';
    obiect_arrConversatie.text = mesajInput;
    obiect_arrConversatie.idConversatie = id;
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
            
        >{account.prenume[0].toUpperCase()}</Avatar>
        </Popover> : <UserOutlined />}
              
        <MessageOutlined />
        <SettingFilled />
        <BsBookmarkStar />
        </div>
      </div>
      <div id = 'divIstoric'>
        <div id = 'divNewChat' onClick = {() => {
            // console.log('executare')
            // insereazaConvNoua(account.uid)
            setArrConversatie([]);
            setIdConversatie('');
            setTitluConv('');

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
            <div className = 'divItemContinutIstoric'>
            {console.log('AAA', item.idconversatie)}
            <div className = {(item.idconversatie == idConversatie) ? 'divClicat divItemIstoric' : 'divItemIstoric'}
            
              onClick = {() => {
                setIdConversatie(item.idconversatie) 
                
                // setIdClickedConv(item.idconversatie)
                
                // console.log('AAA', item.idconversatie)
                // console.log(idClickedConv)
                loadConv(item.idconversatie)
                window.location.pathname = `/c/${item.idconversatie}`
                // fetch(`http://localhost:8000/mesaje?idconversatie=${item.idconversatie}`)
                //   .then(r => r.json())
                //   .then(rr => {
                //     // console.log(rr)
                //     setArrConversatie(rr)
                //   })
              }}
              >{item.mesajfinal ? item.mesajfinal : "New conversation"}
            </div>
            <DotsDD idc = {item.idconversatie} fav = {item.favorite} arrIstConv = {arrIstoricConversatii} setArrIstConv = {setArrIstoricConversatii}/>
            </div>
            )}
        </div>

      </div>
      {/* {!idConversatie ? <div id = 'divConvInit'>
        <div id = "mesajInitial">{mesajInitial}</div>
        <div id = 'divInterm'></div>
        <div id = 'divMesaj2'>
        
        
          <Input 
            id = 'inputMesaj2' style = {{width: '70%', height: '45px', border: 'none', marginLeft: '60px', marginRight: '70px'}} 
            placeholder = 'Type your message...'
            value = {mesajInput}
            onChange = {(e) => setMesajInput(e.target.value)}
            onPressEnter = {(e) => {
              insereazaConvNoua(account.uid)
              trimiteMesaj()
              setMesajInput('')
            }}
          />

        <Tooltip title="Send message">
          <div id = 'parSend2' onClick = {() => {
            if (mesajInput == '') return
            trimiteMesaj()
            setMesajInput('')
          }}  >
                      
          <SendOutlined 
              style = {{fontSize: '20px'}} 
                    
          />  
           
          </div>
          </Tooltip>
         
        </div>

      </div> :  */}
      <div id = 'divPrincipal'>
        <div id = 'divUtilizator'>{titluConv}</div>
        <div id = 'divContinut' ref={scrollableDivRef}>
          
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
              let idConvReturnat = '';
              console.log(arrConversatie.length)
              // console.log('AAAAAAA', insereazaConvNoua(account.uid))
              if (arrConversatie.length == 0) {
                idConvReturnat = insereazaConvNoua(account.id);
                setIdConversatie(idConvReturnat);
                trimiteMesaj(idConvReturnat);
                setMesajInput('')
              }
              else {
                trimiteMesaj(idConversatie);
                setMesajInput('')
              }

            }}
          />

        <Tooltip title="Send message">
          <p id = 'parSend' onClick = {() => {
            if (mesajInput == '') return
            let idConvReturnat = '';
            console.log(arrConversatie.length)
            // console.log('AAAAAAA', insereazaConvNoua(account.uid))
            if (arrConversatie.length == 0) {
              idConvReturnat = insereazaConvNoua(account.id);
              setIdConversatie(idConvReturnat);
              trimiteMesaj(idConvReturnat);
              setIsInTrimitere(true);
              setMesajInput('')
            }
            else {
              setIsInTrimitere(true);
              trimiteMesaj(idConversatie);
              setMesajInput('')
            }
           }}  >

          {/* {<SendOutlined 
              style = {{paddingTop: '10px'}} 
                    
          />}          */}
          {!isInTrimitere ? <SendOutlined 
              style = {{paddingTop: '10px'}} 
                    
          /> : <SyncOutlined spin></SyncOutlined>}  
           
          </p>
          </Tooltip>
         
        </div>
      </div>
      {/* } */}
    </div>
  );
}

export default App;
