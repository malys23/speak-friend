export default function FriendsList({friends}){
    if(friends.length === 0) return <p>No friends yet</p>;
    
    return (
        <div className='friends-list'>
            <h2> Friends </h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.friend_id}>
                        <img
                            src={friend.avatar_url}
                            alt={friend.username}
                        />
                        <span>{friend.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}