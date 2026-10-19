import { Link } from 'react-router';
export default function WelcomePage(){
    return (
        <>
            <p>
                <Link to='auth/login'> Login </Link>
            </p>
            <h1>Speak Friend and Enter!</h1>
        </>
    );
}