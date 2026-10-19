import { Form, Link,  } from 'react-router-dom';
import { useActionData } from 'react-router';

export default function LoginPage(){
    const actionData = useActionData();

    return (
        <>
            <Form method='post'>
                <h1>Login</h1> 
                 {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}               
                <p>
                    <label>Email</label>
                    <input id='email' type='email' name='email' required/>
                </p>
                <p>
                    <label>Password</label>
                    <input id='password' type='password' name='password' required/>
                </p>  
                <div>
                    <Link to='/auth/register'>Create Account</Link>
                    <button type='submit'>Login</button>
                </div>                           
            </Form>

        </>
    );
}

