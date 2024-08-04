import React, {useEffect, useState} from 'react';
import Mesaj from './components/Mesaj';

const Share = () => {
  const [arrConversatie, setArrConversatie] = useState([]);
  const [titluConv, setTitluConv] = useState('');
  function formateazaData (data) {
    let objDate = new Date (data)
    return objDate.toLocaleString('ro-Ro').slice(0, 17)
  }
  useEffect(() => {
    const queryString = window. location. search;
    const urlParams = new URLSearchParams(queryString);
    const idConversatie = urlParams. get('idc'); 
    console.log(idConversatie)
    fetch(`http://localhost:8000/verificareLink?idc=${idConversatie}`).then((r) => {
      console.log(r)
      if (r.status == 200) {
        fetch( `http://localhost:8000/mesaje?idconversatie=${idConversatie}`).then(r => r.json())
        .then(r => {
          console.log(r)
          setArrConversatie(r.mesaje)
          setTitluConv(r.titlu)
        })
      }
    }) 
    

  }, [])



  return (
    <>
    <div id = 'divTitluShare'>
      {titluConv}
    </div>
    <div id = 'divDataShare'>

    </div>
    <div id = 'divPrincShare'>
      
      {arrConversatie.map((item) => <Mesaj text = {item.text} exp = {item.exp} data = {formateazaData(item.data)}></Mesaj>)}
    </div>
    </>
  )
}

export default Share