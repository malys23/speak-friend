import Message from '../Message.jsx';

export default function MessageList({messages, currentUserId}){
    return (
        <div className='message-list'>
            {messages.map(msg=>(
                <Message key={msg.id} message={msg} currentUserId={currentUserId}/>
            ))}
        </div>
    );
}