import './DummyMessenger.css'
import { useState } from 'react';
import MessageList from './MessageList/MessageList';
import MessageInput from './MessageInput';

const mockMessages = [
        {
            id: 1, 
            content: 'Speak friend and enter?',
            username: 'Gandalf',
            user_id: 1,
            created_at: '2026-01-01T10:00:00Z'
        },
        {
            id: 12, 
            content: "What's elvish for friend?",
            username: 'Frodo',
            user_id: 2,
            created_at: '2026-01-01T10:01:00Z'
        }
];


export default function DummyMessenger({currentUserId }){
    const [messages, setMessages] = useState(mockMessages);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    // function handleSend(){
    //     //send message to backend
    // }

    return (
        <div className="chat-window">
            <MessageList messages={messages} currentUserId={currentUserId}/>
            <MessageInput />
        </div>
    );
}