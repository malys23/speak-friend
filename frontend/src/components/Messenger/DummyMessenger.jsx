import { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function DummyMessenger(){
    const [messages, setMessage] = useState();

    return (
        <div>
            <MessageList message={messages}/>
            <MessageInput />
        </div>
    );
}