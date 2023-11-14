import React, { useState, } from 'react';
import axios from 'axios';

import LoginToken from './LoginToken'
import './Login.css'

const LoginForm = ({LoginHide}) => {
    const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

    const toggleForms = () => {
        setIsRegisterFormVisible(!isRegisterFormVisible);
    };
    const [dataName, setName] = useState('');
    const [dataPassword, setPassword] = useState('');
    const [dataEmail, setEmail] = useState('');
    
    const signUpDB = async (e) => {
    e.preventDefault();
    if(dataName === '' || dataPassword === '' || dataEmail === ''){
        alert('필드를 모두 작성해주세요!');
    }else{
        try {
        const response = await axios.post('http://nmwoo.info/backend/sign_post.php', {
            email: dataEmail,
            password: dataPassword,
            nickname: dataName,
        });
        if(response.data.message === 'Post saved successfully'){

            toggleForms();
        }else{
            alert(response.data.message);
            console.log(response.data.message);
        }
        } catch (error) {
        console.error('Error saving post:', error);
        }
    }
    };
    const loginDB = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://nmwoo.info/backend/login_post.php', {
        password: dataPassword,
        nickname: dataName,
        });
        LoginToken(dataName)
    } catch (error) {
        console.error('Error saving post:', error);
    }
    };

    const Close =() =>{
        LoginHide()
    }

    return(
        <div className='loginBox position-fixed w-100 h-100'>
            <div className='bgCover position-fixed w-100 h-100' style={{background:'#0000001c'}} onClick={Close}></div>
            <div className="form">
            {isRegisterFormVisible ? (
            <form className="register-form" onSubmit={signUpDB}>
                <input className='p-3 mb-3' type="text" placeholder="name" value={dataName} onChange={(e) => setName(e.target.value)}/>
                <input className='p-3 mb-3' type="password" placeholder="password" value={dataPassword} onChange={(e) => setPassword(e.target.value)}/>
                <input className='p-3 mb-3' type="text" placeholder="email address" value={dataEmail} onChange={(e) => setEmail(e.target.value)}/>
                <button className='p-3 mb-3' type="submit">create</button>
                <p className="message">Already registered? <a href="#" onClick={toggleForms}>Sign In</a></p>
            </form>
            ) : (
            <form className="login-form" onSubmit={loginDB}>
                <input className='p-3 mb-3' type="text" placeholder="username" value={dataName} onChange={(e) => setName(e.target.value)}/>
                <input className='p-3 mb-3' type="password" placeholder="password" value={dataPassword} onChange={(e) => setPassword(e.target.value)}/>
                <button className='p-3 mb-3' type="submit">login</button>
                <p className="message">Not registered? <a href="#" onClick={toggleForms}>Create an account</a></p>
            </form>
            )}
            </div>
        </div>
    )
}

export default LoginForm