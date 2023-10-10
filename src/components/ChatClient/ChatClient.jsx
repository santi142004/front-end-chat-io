import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react'

const socket = io("http://localhost:4000");

export const ChatClient = () => {

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const[showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject) =>{
    setMessage(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false)
  }
  const [listMessages, setListmessage] = useState([{
    body: "Bienvenido al chat",
    user: "Machine",
  }]);

  const handleSubmit = (event) =>{
    event.preventDefault();
    socket.emit('message', {body:message, user: username})

    const newMsg = {
      body: message,
      user: username
    }

    setListmessage([...listMessages, newMsg]);
    setMessage('');
  }

  useEffect(() => {
    const receiveMessage = msg =>{
      setListmessage([...listMessages, msg])
    }

    socket.on('message', receiveMessage)
  
    return () => socket.off('message', receiveMessage)
  }, [listMessages])
  

  return (
    <>
      <input onChange={event => setUsername(event.target.value)} className='txt-username' placeholder='username' type="text" />

      <div className="div-chat">
        {
          listMessages.map( (message, idx) => (
            <p key={message+ idx}>{message.user} :{message.body}</p>
          ))
        }
        <form onSubmit={handleSubmit} className='form'>
          <span className='title'>Chat-io</span>
          <p className='description'>Escribe tu mensaje.</p>
          <div className='div-type-chat'>
            <img 
              className='emoji-icon'
            // src="https://icons.getbootstrap.com/assets/icons/emoji-sunglasses-fill.svg"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker(!showPicker)}  />
            {showPicker && <Picker className="prueba" onEmojiClick={onEmojiClick} />}
            <input
            value={message}
            placeholder='Ingresa tu mensaje'
            onChange={e => setMessage(e.target.value)}
            type="text" name='text' id='chat-message'
            className='input-style'
            />
            <button type='submit'>Enviar</button>
          </div>
        </form>
      </div>
    
    </>
  )
}
