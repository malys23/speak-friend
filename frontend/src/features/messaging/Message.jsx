import './Message.css';

export default function Message({message, currentUserId }){
    const isOwn = (message.user_id === currentUserId);

    return (
        <div className={`message ${isOwn ? 'own' : ''}`}
            role='article'
        >
            {!isOwn && <span className='username'>{message.username}</span>}
            <p>{message.content}</p>
            <span className='timestamp'>
                {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        </div>
    );
}