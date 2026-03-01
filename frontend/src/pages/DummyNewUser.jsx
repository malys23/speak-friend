import {Form} from 'react-router';

export default function DummyNewUserPage(){
    return (
        <>
            <Form method='post'>
                <h1>Create New User</h1>
                <p>
                    <label>Username</label>
                    <input id='username' type='text' name='username' required/>
                </p>
                <p>
                    <label>Email</label>
                    <input id='email' type='email' name='email' required/>
                </p>
                <p>
                    <label>Date of Birth</label>
                    <input type='date' name='dob' required></input>
                </p>
                <p>
                    <label>Password</label>
                    <input id='password' type='password' name='password' required/>
                </p>  
                <div>
                    <button type='submit'>Register</button>
                </div>                           
            </Form>
        </>
    );
}