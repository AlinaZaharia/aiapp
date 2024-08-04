import React, {useState} from 'react';
import { CiTrash} from "react-icons/ci";
import {UploadOutlined, EditOutlined} from '@ant-design/icons';
import { BsBookmarkStar } from "react-icons/bs";
import { Button, Modal } from 'antd';
import { FaStar } from "react-icons/fa";


const DotsDD = (props) => {
  const [isDDOpen, setIsDDOpen] = useState (false);
  const [isModalShareOpen, setIsModalShareOpen] = useState(false);
  const [mesajEroare, setMesajEroare] = useState ('');
  const [linkConversatie, setLinkConversatie] = useState('');
  const showModal = () => {
    setIsModalShareOpen(true);
  };
  // const [open, setOpen] = useState(false);

  function handleClickDD (buton) {
    if (buton == 'Șterge') {
      fetch(`http://localhost:8000/conversatie/${props.idc}`, {method: 'DELETE'}).then(r => {
        // console.log(r)
        if (r.status == 204) {
          let arrIntConversatii = [...props.arrIstConv];
          arrIntConversatii = arrIntConversatii.filter((element) => element.idconversatie != props.idc);
          props.setArrIstConv(arrIntConversatii);
          setIsDDOpen(false);
        }
      })
    }

    if (buton == 'Partajeaza') {
      setIsModalShareOpen(true);
      setIsDDOpen(false);


    }
  }

  const handleCancel = () => {
    setIsModalShareOpen(false);
  };

  
  const handleCopyClick = async () => {
    try {
        await window.navigator.clipboard.writeText(linkConversatie);
        alert("Copied to clipboard!");
    } catch (err) {
        console.error(
            "Unable to copy to clipboard.",
            err
        );
        alert("Copy to clipboard failed.");
    }
  };

  return (
   <>
   
      <Modal title={<div id = 'divMesajEroare'>{mesajEroare}</div>} open={isModalShareOpen} footer = {[<></>]} onCancel={handleCancel} >
        <div id = 'divLinkConv'>
          <p><button className = 'butonCreeazaLink' onClick = {() => {
            let objIDC = {};
            objIDC.idc = props.idc;
            fetch(`http://localhost:8000/partajarelink?`, {method: 'POST', body: JSON.stringify(objIDC), headers: {"Content-Type": "application/json"}})
            .then(r => {
              console.log(r)
              if (r.status == 200) {
                setMesajEroare('');
                setLinkConversatie(`http://localhost:3000/share?idc=${props.idc}`)
              }
              else setMesajEroare('Eroare');

            })
          }}>Creeaza link</button></p>
          <p><input id = 'inputLinkConv' value = {linkConversatie}></input></p>
          <p><button className = 'butonCreeazaLink' onClick = {handleCopyClick}>Copiaza link</button></p>
        </div>
        
      </Modal>
    
    <div 
        className = 'divDots' 
        
    >
        <FaStar className = {props.fav == 'da' ? 'FaStar' : ''} onClick = {() => {
            
          let objFav = {};
          objFav.idc = props.idc;
          if (props.fav == 'da') {
            objFav.fav = 'nu'
            
          }
          else objFav.fav = 'da';

          let arrIntIstoricConversatii = [...props.arrIstConv];
          // console.log(arrIntIstoricConversatii);
          arrIntIstoricConversatii.forEach((item) => {
            if (item.idconversatie == props.idc) {
              if (item.favorite == 'da') item.favorite = 'nu';
              else item.favorite = 'da';
            }
          })
          props.setArrIstConv(arrIntIstoricConversatii);

          
          fetch('http://localhost:8000/favorite', {method: 'PUT', body: JSON.stringify(objFav), headers: {"Content-Type": "application/json"}})
        }}/>
        <div onClick = {() => setIsDDOpen(!isDDOpen)}>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
          </svg>
        </div>
        
    </div>
    <div id = 'divFaStar'></div>
    
    <div className = {isDDOpen ? 'dropDownDeschis' : 'dropDownInchis'}>
        <div className = 'itemDD' onClick = {() => {handleClickDD('Partajeaza')}}><UploadOutlined />Partajeaza</div>
        <div className = 'itemDD'><BsBookmarkStar />Favorite</div>
        <div className = 'itemDD'><EditOutlined />Redenumeste</div>
        <div 
            className = 'itemDD' 
            onClick = {() => {
                handleClickDD('Șterge')
            }} 
            style = {{color: 'red'}}>
                <CiTrash />Șterge</div>
    </div>
  </>
  )
}

export default DotsDD