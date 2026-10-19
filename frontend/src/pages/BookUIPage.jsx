import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router';
import UserProfile from "../features/profile/UserProfile";
import Friends from "../features/friends/Friends";

const PAGES = {
    profile: <UserProfile />,
    friends: <Friends/>,
    messages: <div>Messages coming soon</div>,
    groups: <div>Groups coming soon</div>
}

export default function BookUIPage(){
    const [activePage, setActivePage ] = useState('profile');
    const logout = useAuthStore((state)=> state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    }

    return(
        <section className='book-ui'>
            <h1>Welcome</h1>
            <div className = 'book-nav'>
                <button onClick={()=>setActivePage('profile')}>Profile</button>
                <button onClick={()=>setActivePage('friends')}>Friends</button>
                <button onClick={()=>setActivePage('messages')}>Messages</button>
                <button onClick={()=>setActivePage('groups')}>Groups</button>
            </div>
            <div className='book-content'>
                {PAGES[activePage]}
            </div>
            <p>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </p>
        </section>        
        //Call User profile (display user info, maybe edit)
        //Call friends page (display friends, add friends, message friend)
        //Call messages page (display room list, enter room list)
            //Call Chatroom (write, read send messages)
    );
}