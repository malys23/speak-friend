export default function ProtectedRoute({children}){
    
    const token = localStorage.getItem('token');
    console.log('ProtectedRoute token: ', token);

    if(!token){
        return <Navigate to='/auth/login'/>;
    }

    return children;
}