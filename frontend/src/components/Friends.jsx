import { useState, useEffect } from 'react';
import { 
    getFriends, 
    getPendingRequests, 
    acceptFriendRequest, 
    declineFriendRequest,
    subscribeFriendRequest,
    subscribePendingRequests,
    unsubscribeFriendRequest,
    unsubscribePendingRequests,
    requestPendingRequests 
} from '../services/friendService';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import AddFriends from './AddFriends';

export default function Friends(){
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const loadData = async () => {
            try{
                const [friendsData, pendingData] = await Promise.all([
                    getFriends(),
                    getPendingRequests()
                ]);
                setFriends(friendsData);
                setPendingRequests(pendingData);
            }catch(err){
                setError('Failed to load friends');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        subscribeFriendRequest((request) => {
            setPendingRequests(prev => [...prev, request]);
        });

        subscribePendingRequests((requests) => {
            setPendingRequests(requests);
        });

        requestPendingRequests();

        return () => {
            unsubscribeFriendRequest();
            unsubscribePendingRequests();
        }
    }, []);

    const handleAccept = async (friendId) => {
        try{
            await acceptFriendRequest(friendId);
            setPendingRequests(prev=>
                prev.filter(r => r.friend_id !==friendId)
            );
            const updatedFriends = await getFriends();
            setFriends(updatedFriends);
        }catch(err){
            console.error('Failed to accept request:', err);
        }
    }

    const handleDecline = async (friendId) => {
        try{
            await declineFriendRequest(friendId);
            setPendingRequests(prev =>
                prev.filter(r => r.friend_id !== friendId)
            );
        }catch(err){
            console.error('Failed to decline request:', err);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h1>Friends List</h1>
            <FriendRequests 
                requests={pendingRequests}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
            <FriendsList friends={friends}/>
            <p>
                <button onClick={() => setShowAddFriend(!showAddFriend)}> {showAddFriend ? 'Cancel' : 'Add Friend'}</button>
            </p>
            {showAddFriend && (
                <AddFriends onRequestSent={()=>setShowAddFriend(false)}/>
            )}
        </section>
    );
}