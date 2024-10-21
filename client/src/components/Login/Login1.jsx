import React, { useState, useEffect } from 'react';
import backdrop from '../../assets/backdrop.png';
import './Login.css';
import Spinner from '../../elements/Spinner/Spinner';
import validate from '../../helpers/inputValidator';
import { actionTypes } from '../../contexts/StateReducers';
import { useStateValue } from '../../contexts/StateContextProvider';
import axios from '../../axios';

const Login = () => {
    const [auth, setAuth] = useState(false);
    const initialSignup = {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    const initialLogin = {
        email: '',
        password: ''
    };
    const [{ user }, dispatch] = useStateValue();
    const [token,setToken] = useState();
    const [signupState, setSignupState] = useState(initialSignup);
    const [loginState, setLoginState] = useState(initialLogin);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    const cleanupState = () => {
        setIsSigning(false);
        setSignupState(initialSignup);
        setLoginState(initialLogin);
        setError('');
        setLoading(false);
    };

    const toggleAuth = () => {
        setAuth(auth => !auth);
        cleanupState();
    };

    const auths = (user,token) => {
        try {
            localStorage.setItem('twittie_user', JSON.stringify(user));
            // localStorage.setItem('access_token',token);
            sessionStorage.setItem('access_token', token);
            setToken(token);
            dispatch({
                type: actionTypes.SET_USER,
                user: JSON.parse(localStorage.getItem('twittie_user'))
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            return;
        }
    };

    const onSubmitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { email, password } = loginState;

        try {
            // const response = await fetch('http://localhost:4000/api/v1/auth/sign-in', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },

            //     body: JSON.stringify({ email, password }),
            //     // body:{ email, password },
            // });

            const response = await axios.post('/auth/sign-in',{email,password});


            // const result = await response.json();
            const result = response.data;
            console.log({response});
            

            if (response.status === 200) {
                auths(result.data.user,result.token);
            } else {
                setError(result.message || 'Invalid credentials');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred, please try again');
            setLoading(false);
        }
    };

    const onSubmitSignup = async () => {
        const { name, username, email, password } = signupState;

        try {
            // const response = await fetch('http://localhost:4000/api/v1/auth/sign-up', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ name, username, email, password }),
            //     // body: { username, email, password }
            // });
            const response  = await axios.post('/auth/sign-up');
            console.log({response});

            const result = await response.data;

            if (response.status === 200) {
                toggleAuth(); // switch to login after successful signup
            } else {
                setError(result.message || 'An error occurred, please try again');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred, please try again');
            setLoading(false);
        }
    };

    const preSignup = (e) => {
        e.preventDefault();
        setIsSigning(true);
        const validationError = validate(signupState);
        if (!validationError.length) {
            setLoading(true);
            onSubmitSignup();
        } else {
            setError(validationError);
            setLoading(false);
        }
    };

    return (
        <section className='login__section'>
            <div className={`login__container ${auth ? 'active' : ''}`}>
                <div className="user signinBc">
                    <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>
                    <div className="formBc">
                        <form autoComplete="off" onSubmit={onSubmitLogin}>
                            <h2>Log In</h2>
                            <input type="email" name='email' placeholder='Email' value={loginState.email} onChange={e => setLoginState({ ...loginState, email: e.target.value })} />
                            <input type="password" name='password' placeholder='Password' value={loginState.password} onChange={e => setLoginState({ ...loginState, password: e.target.value })} required />
                            <button type='submit' className='button'>{loading ? <Spinner /> : 'Log in'}</button>
                            {error.length > 0 && <div className='error'>{error}</div>}
                            <p className="signup">Don't have an account? <span onClick={toggleAuth}>Sign up</span></p>
                        </form>
                    </div>
                </div>
                <div className="user signupBc">
                    <div className="formBc">
                        <form autoComplete="off" onSubmit={preSignup}>
                            <h2>Create an Account</h2>
                            <input type="text" name="name" placeholder='Full Name' value={signupState.name} onChange={(e) => setSignupState({ ...signupState, name: e.target.value })} />
                            <input type="text" name="username" placeholder='Username' value={signupState.username} onChange={(e) => setSignupState({ ...signupState, username: e.target.value })} />
                            <input type="text" name="email" placeholder='Email' value={signupState.email} onChange={(e) => setSignupState({ ...signupState, email: e.target.value })} />
                            <input type="password" name="password" placeholder='Create Password' value={signupState.password} onChange={(e) => setSignupState({ ...signupState, password: e.target.value })} />
                            <input type="password" name="confirmPassword" placeholder='Confirm Password' value={signupState.confirmPassword} onChange={(e) => setSignupState({ ...signupState, confirmPassword: e.target.value })} />
                            {error.length > 0 && <div className='error'>{error}</div>}
                            <button type='submit' className='button'>{loading ? <Spinner /> : 'Sign up'}</button>
                            <p className="signup">Have an account? <span onClick={toggleAuth}>Log in</span></p>
                        </form>
                    </div>
                    <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>
                </div>
            </div>
        </section>
    );
};

export default Login;
