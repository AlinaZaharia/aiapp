import React from 'react';
import {Avatar} from 'antd';
import {OpenAIOutlined} from '@ant-design/icons';

const Mesaj = (props) => {
    let varAvatar = <Avatar 
    style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}></Avatar>

    let varAI = <OpenAIOutlined />
    let objDate = new Date (props.data)
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
                   <span className="text-sm font-semibold text-gray-900 dark:text-white">{props.exp}</span>
                   <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{props.data}</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{props.text}</p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
             </div>
             
             
          </div>
          )
      }


  return (
    
    aranjeazaConversatie(props.exp, props.text, objDate.toLocaleString('ro-Ro').slice(0, 17))
    
  )
}

export default Mesaj