Conversation.js
import React, {useEffect, useState, useRef, useContext} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Input} from 'antd';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import HTMLviewer from '../components/HTMLviewer';
import {SendOutlined} from '@ant-design/icons';
import {AuthContext} from '../App';
import { sendLog } from '../utils';
import FeedbackModal from '../components/FeedbackModal';

const Conversation = (props) => {

    const {convoID} = props;
    const [convo, setConvo] = useState([]);
    const [sizes, setSizes] = useState(['25%', '75%']);
    const [link, setLink] = useState();
    const [msg, setMsg] = useState('');
    const [symbol, setSymbol] = useState('');
    const [dragging, setDragging] = useState();
    const [reportData, setReportData] = useState();
    const [isReportShown, setIsReportShown] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
    const [isOpenSuggestionModal, setIsOpenSuggestionModal] = useState(false);

    const navigate = useNavigate();
    const endOfChatRef = useRef(null);
    const {CREDITS, setCREDITS} = useContext(AuthContext);

    let messageCounter=0;

    useEffect(() => {
        loadConversation().then(convoObj => {
            const convoData = convoObj[1][0];
            loadReport(convoData.cik)
            setSymbol(convoData.symbol);
        });
    }, []);
    useEffect( () => { 
        // scroll chat div to end
        if (endOfChatRef.current) {
            endOfChatRef.current.scrollTop = endOfChatRef.current.scrollHeight;
        }

        if(convo?.length){
            let filingID = reportData?.filingid;
            if(!filingID) return alert('No filingID', reportData);
    
            const thisMessage = convo[convo.length-1];
            let {msg, agent, sent, incoming, first, db_notsend} = thisMessage;
            if(sent) return;

            // new message section
            const headers = {'Content-Type':'application/json'};
            const db_payload = {msg, convoID, agent};

            if(incoming){
                function decodeAgent(agent){return {'cl':'user', 'ai':'assistant'}[agent]}
                let last_4_msgs = convo.slice(-5).map(el => {return {role:decodeAgent(el.agent), content:el.msg?.slice(0,200)}});
                let messages = last_4_msgs;
                const ai_payload = {messages:JSON.stringify(messages.filter(x => x.content)), filingID, convoID};

                function send_completion(){
                    fetch(`${window.appdata.API_ADDR}/completionproxy`, {   
                        method:'POST', 
                        body:JSON.stringify(ai_payload), 
                        headers:{'Content-Type':'application/json', responseType:'stream'},
                        credentials: 'include',
                    }).then(response => {    
                        if(response.status != 200){
                            return setConvo([...convo, {agent:'ai', msg:'An error occured. Please refresh and try again.' , incoming:false, db_notsend:true}]);
                        }

                        const reader = response.body.getReader();
                        
                        const decoder = new TextDecoder('utf-8');
                        let result = '';
                        
                        // -------------- SUBTRACT INTERFACE CREDIT -------------- \\
                        if(response.status ===  200) setCREDITS(CREDITS-1);
    
                        // -------------- PROCESS INCOMING STREAM -------------- \\
    
                        reader.read().then(function processText({ done, value }) {
                            result += decoder.decode(value, { stream: true });
                            let messages = result?.split('[ss]');
                            if (done) {
                                const lastMessage = convo.pop();
                                // Handle not enough credits msg
    
                                if(result == 'Monthly query limit exceeded' && response.status == 403){
                                    return setConvo([...convo, {agent:'ai', msg:result , incoming:false, db_notsend:true}]);
                                }
    
                                db_payload.msg = lastMessage.msg;
                                setConvo([...convo, {...lastMessage, incoming:false, db_notsend:true}]);
                                const db_promise = sendMessageToDB(db_payload, headers);
                                return;
                            }
                            
                            // Last entry might be incomplete if not ended with a newline
                            result = messages.pop();
    
                            messages.forEach(message => {
                                message = message.replaceAll('\n\n', '\n');
                                message = message.replaceAll('\n', '<br>');
                                try {
                                    let incomingMsg;
                                    let newConvo = [];
                                    for(let msg of convo){
                                        if(msg.incoming) incomingMsg=msg;
                                        else newConvo.push(msg);
                                    }   
                                    if(!incomingMsg) throw new Error('No incoming msg found (sync issue?)'); 
                                    incomingMsg.msg = (incomingMsg.msg ?? '') + message; 
                                    incomingMsg.first=false;
                                    setConvo([...newConvo, incomingMsg]);
                                } catch (err) {
                                    console.error('Error parsing message:', message, err);
                                }
                            });
            
                            // Read the next chunk
                            reader.read().then(processText);
                        });
                    })
                }

                if(first) send_completion();
                
                
                return;
            }

            if (db_notsend) return;
            msg = msg.replace('[AI]:', '');
            const db_promise = sendMessageToDB(db_payload, headers);
            
            if(agent == 'cl'){ // send to AI API
                const incoming_convo_msg = {agent:'ai', incoming:true, first:true};
                setConvo([...convo, incoming_convo_msg]);
            }
              
            if(agent == 'ai'){ // send to DB
                db_promise.then(() => {
                    convo.pop();
                    setConvo([...convo, {...thisMessage, sent:true}]);
                })
            }
        }
    },[convo]);

    useEffect(() => {

        if(isReportShown === true) setIsReportLoading(true);
        setTimeout(() => {setIsReportLoading(false)}, 5000);
    }, [isReportShown]);

    async function sendMessageToDB(db_payload, headers){
        //if(!db_payload.msg) return console.log('No message')
        return await axios.post(`${window.appdata.API_ADDR}/messages`, db_payload, {headers, withCredentials:true})
            .catch(err => sendLog('Code 3 messages ' + String(err)));
    }

    async function loadConversation(){
        const convo_res = await axios.get(`${window.appdata.API_ADDR}/conversations/${convoID}`)
            .catch(err => sendLog('Code 4 conversations ' + String(err)));
        const convo_obj = convo_res?.data;
        let [convo, reportData] = convo_obj;
        convo.forEach(x => x.sent=true) //mark as sent
        setConvo(convo);
        setReportData(reportData[0]);
        return convo_obj;
    }

    async function loadReport(cik){
        if(!cik) return alert('No symbol');
        setLink(`${window.appdata.API_ADDR}/lastreport/${cik}`);
    }
    
    function renderMessages(){
        if(!convo.length) return <></>
        return (
            <>
                {convo?.map(message => {
                    messageCounter++;
                    const rowtype = (message.agent === 'ai' ? 'ai-message-row' : 'user-message-row');
                    const divtype = (message.agent === 'ai' ? 'ai-message-msg' : 'user-message-msg');
                    const loadingClass = message.first ? 'loading-msg' : ''
                    return <div className={rowtype} key={messageCounter}>
                                <div className={`message ${divtype} ${loadingClass}`}>
                                    {message.msg?.split('<br>')?.map((paragraph, ix) => <div key={ix}>{ix>1 && <br></br>}<p>{paragraph}</p></div>) || '...'}
                                    {/* {message.msg || '...'} */}
                                </div>
                            </div>
                })}
            </>);
    }    

    function sendMessage(msg, agent){
        if(!['cl', 'ai'].includes(agent)) return alert('invalid agent'); //TODO: centralize
        const msg_obj = {msg, agent};
        setConvo([...convo, msg_obj]); // add to convo stack
    }

    async function onMsgSend(e){
        e.preventDefault();
        if(!msg?.length) return;
        sendMessage(msg, 'cl'); 
        setMsg('');
    }

    const startDrag = () => {setDragging(true)};
    const stopDrag = () => {setDragging(false)};

    function formatDate(datestring){
        if(!datestring) return;
        datestring = new Date(datestring);
        datestring = datestring.toISOString().split('T')[0];
        return datestring;
    }
    
    return (
        <div id="convo-container">
            <FeedbackModal isOpen={isOpenSuggestionModal} setIsOpen={setIsOpenSuggestionModal} title={'Write us a suggestion'}></FeedbackModal>
            <FeedbackModal isOpen={isOpenErrorModal} setIsOpen={setIsOpenErrorModal} title={'Report a problem'}></FeedbackModal>

            <div id="convo-sidebar">
                <div id="sidebar-upper" className="sidebar-section">
                    {/* <div className="text-center flex-center">
                        <img src="/nr_logo.png" id="logo-convo"></img>
                    </div> */}
              
                    <div className="flex-row convo-logo-container darken-hover">
                        <img src="/nr_logo.png" id="logo-convo"></img>
                        <div id="logo" onClick={() => navigate('/portal')}><img src="/nr_full_logo.svg"></img></div>
                    </div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Symbol</div>
                        <div>{reportData?.symbol || 'N/A'}</div>
                    </div>
                    <hr></hr>
                    <div className="convo-symboldata text-right">
                        <div className="convo-symboldata-title">Name</div>
                        <div>{reportData?.name || 'N/A'}</div>
                    </div>
                    <hr></hr>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Report date</div>
                        <div>{formatDate(reportData?.repdate) || 'N/A'}</div>
                    </div>
                    <hr></hr>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Type</div>
                        <div>{reportData?.typ || 'N/A'}</div>
                    </div>
                    <hr></hr>
                    <div className="convo-symboldata darken-hover clickable" onClick={()=>navigate('/subscription')}>
                        <div className="convo-symboldata-title">Remaining queries</div>
                        <div>{CREDITS || '0'}</div>
                    </div>
                </div>
                
                <div id="sidebar-section-lower" className="sidebar-section">
                   {(CREDITS < 100) && <div className="convo-subscription convo-getsubscription darken-hover clickable" onClick={()=>navigate('/subscription')}>
                        {/* <div className="convo-symboldata-title">Subscribe</div> */}
                        <div className="sidebar-subscribe-button">
                            <div className="convo-symboldata-title">Subscribe</div>
                            <div>Get queries</div>
                        </div>
                    </div>} 
                    <hr className="sidebar-hr"></hr>
                    <div className="convo-symboldata convo-getsubscription darken-hover convo-blue clickable convo-subscription" onClick={()=>{setIsOpenSuggestionModal(!isOpenErrorModal)}}>
                        <div className="convo-symboldata-title max-width">Give us a suggestion</div>
                    </div>
                    <div className="convo-symboldata convo-getsubscription darken-hover convo-red clickable" onClick={()=>{setIsOpenErrorModal(!isOpenErrorModal)}}>
                        <div className="convo-symboldata-title max-width">Report a problem</div>
                    </div>
                </div>
                <div id="active-convos"></div>
            </div>
            <div id="convo-splitpane">
                <div id="loading-panel-container" hidden={!isReportLoading}>
                    <div className="sk-folding-cube">
                        <div className="sk-cube1 sk-cube"></div>
                        <div className="sk-cube2 sk-cube"></div>
                        <div className="sk-cube4 sk-cube"></div>
                        <div className="sk-cube3 sk-cube"></div>
                    </div>
                </div>
                <SplitPane
                    split='vertical'
                    sizes={sizes}
                    onChange={setSizes}
                    
                    onDragStart={startDrag}
                    onDragEnd={stopDrag}
                >
                    <Pane minSize={20} maxSize='80%'>
                        
                        <section className="convo-pane" id="convo-pane-left">
                            {dragging && <div className="iframe-cover"></div>}
                            {isReportShown ? <HTMLviewer link={link} title={symbol}></HTMLviewer> 
                            : <div id="convo-pane-left-beforeloading">
                                <button onClick={()=>{setIsReportShown(true)}} type="button" className="h-12 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    Read report</button>
                            </div>}
                        </section> 
        
                    </Pane>

                    <Pane minSize={20} maxSize='80%' id="convo-pane-right">
                        <section className="convo-pane" id="chat-container">
                            
                            <div id="chat-body" ref={endOfChatRef} >{
                                <>

                                    {renderMessages()}
                                    {/* {isWaiting && <div id="messages-container">
                                        <div className='ai-message-row'>
                                            <div className={`message ai-message-msg loading-msg`}>...</div>
                                        </div>
                                    </div>} */}

                                </>}</div>
                            <div id="chat-bar">
                                <SendOutlined onClick={onMsgSend} id="msg-send-icon"/>
                                <Input.TextArea 
                                    value={msg}
                                    size="large" 
                                    // enterButton="Search"
                                    placeholder="Does the company have enough liquid assets to cover their debts?" 
                                    onPressEnter={onMsgSend}
                                    onChange={(e) => setMsg(e.target.value)}
                                    rows={1}
                                />
                            </div>
                        
                        </section>
                    </Pane>
                </SplitPane>
            </div>
        </div>
        
    )
}

export default Conversation;