import { useEffect, useState } from "react";
import React from "react";
import io from "socket.io-client"
import Picker from "emoji-picker-react"
import './ChatClient.css';

const socket = io('https://chat-server-j37h.onrender.com');

export const ChatClient=()=>{
    let [message,setMessage]=useState('');
    let [userName,setUserName]=useState('Machine');
    let [showPicker, setShowPicker] = useState(false);
    let onEmojiClick = (emojiObject) => {
        setMessage( prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
      };
    let [listMessages,setlistMessages]=useState([{
        body:"Bienvenido al chat",
        user:"Machine"
    }])

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('message', {body: message, user: userName});
        const newMsg = {
          body: message,
          user: userName
        }
        setlistMessages([...listMessages,newMsg]);
        setMessage('');
      }    

    useEffect(() => {
        //Muestra por consola el mensaje que el backend me envía
        const receiveMessage = msg => {
          setlistMessages([...listMessages, msg])      
        }
        socket.on( 'message', receiveMessage);
        
        // Función que va a desuscribir el evento
        return () => socket.off( 'message',receiveMessage);
      }, [listMessages])

    return (
        <div className="chat">
          <h1 id="titulo">NiceChat</h1>
          <input onChange={event => setUserName(event.target.value)} className='input' type="text" placeholder='username' />
    
          <div className='div-chat'>
            { listMessages.map( (message, idx) => (
              <p key={message+idx}>{message.user}: {message.body}</p>
              ))
            }
          </div>              
        <form onSubmit={handleSubmit} className="form">
          <div className='div-type-chat'>
            <img
              className="emoji-icon"
              src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
              onClick={() => setShowPicker(!showPicker)} />
            {showPicker && <Picker className="prueba" onEmojiClick={onEmojiClick} />} 
            <input 
              value={message}
              placeholder="Escribe tu mensaje"
              onChange={ e => setMessage(e.target.value)}          
              type="text" name="text" id="chat-message"
              className="input-text" 
            />
            <button type="submit" id="boton">Enviar</button>
          </div>
        </form>    
        </div>
      )
}