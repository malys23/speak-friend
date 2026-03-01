import { useState } from 'react';
import UserProfile from "../components/UserProfile";
import Friends from '../components/Friends';

const PAGES = {
    profile: <UserProfile />,
    friends: <Friends/>,
    messages: <div>Messages coming soon</div>,
    groups: <div>Groups coming soon</div>
}

export default function DummyBookUIPage(){
    const [activePage, setActivePage ] = useState('profile');

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
        </section>        
        //Call User profile (display user info, maybe edit)
        //Call friends page (display friends, add friends, message friend)
        //Call messages page (display room list, enter room list)
            //Call Chatroom (write, read send messages)
    );
}