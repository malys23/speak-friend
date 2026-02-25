import { useState } from 'react';

export default function MessageInput({onSend}){
    const [ input, setInput ] = useState('');

    function handleInputChange(event){
        setInput(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault(); //prevent page refresh
        if(!input.trim()) return; //prevent empty message
        onSend(input);
        setInput(''); //clear input after sending
    }

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input 
                type='text' 
                placeholder='Type a message...' 
                reqired
                onChange={handleInputChange}
            />
            <button type='submit'>Send</button>
        </form>
    );
}