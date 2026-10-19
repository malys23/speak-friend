import {useState} from 'react';
import { sendFriendRequest } from '../services/friendService';

export default function AddFriends({onRequestSent}){
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try{
            await sendFriendRequest(email);
            setSuccess('Friend request sent');
            setEmail('');
            setTimeout(() => onRequestSent(), 1500);
        }catch(err){
            setError(err.response?.data?.message || 'Failed to send request');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <h2> Add Friend </h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email:</label>
                <input
                    id= 'email'
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Friend's email"
                    required
                />
                <button type='submit' disabled={loading}>
                    {loading ? 'Sending...' : 'Send Request'}
                </button>
            </form>
            {error && <p className='error'>{error}</p>}
            {success && <p className='success'>{success}</p>}
        </div>
    );
}