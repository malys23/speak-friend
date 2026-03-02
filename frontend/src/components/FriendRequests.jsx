export default function FreindRequests({requests, onAccept, onDecline}){
    return (
        <div className='friend-requests'>
            <h2>Pending Requests</h2>
            <ul>
                {requests.map(request => (
                    <li key={request.friend_id}>
                        <img
                            src={request.avatar_url}
                            alt={request.username}
                        />
                        <span>{request.username}</span>
                        <p>
                            <button onClick={()=> onAccept(request.friend_id)}> Accept </button>
                        </p>
                        <p>
                            <button onClick={()=> onDecline(request.friend_id)}>Decline</button>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}