import { redirect } from 'react-router-dom';
import { login } from '../services/authService';

export async function loginAction({request}){
    
    const formData = await request.formData();
    const authData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    try{
        const data = await login(authData.email, authData.password);
        console.log('Step 1 - data received', data);

        localStorage.setItem('token', data.token);
        console.log('Step 2 - token stored: ', data.token);

        const redirectResult = redirect('/dungeon');
        console.log('Step3 - redirect created:', redirectResult)

        return redirectResult;


    } catch(err){
        const errorMessage = err.response?.data?.message || 'Invalid username or password';
        return {error: errorMessage };
    };
}