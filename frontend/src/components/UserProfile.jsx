import useAuthStore from '../store/authStore';

export default function UserProfile(){
    const user = useAuthStore((state)=> state.user);
    if(!user) return <p>Loading...</p>

    return (
        <section className = 'user-profile'>
            <h1> Welcome in {user.username} </h1>
            <img
                src={user.avatar_url}
                alt={user.username}
            />
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>{user.dob}</p>
        </section>
    );
}