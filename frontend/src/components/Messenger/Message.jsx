export default function Message({message}){
    return (
        <div className="message">
            <span className='username'>{message.username}</span>
            <p>{message}</p>
            <span className='timestamp'>{message.created_at}</span>
        </div>
    );
}