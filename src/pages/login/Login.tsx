import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import './Login.css';

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [rightPanelActive, setRightPanelActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();
    const from = (location.state as { from?: string })?.from || '/';

    const handleSignUpClick = () => {
        setRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setRightPanelActive(false);
    };

    const handleSignInSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('http://remote-lunar.ddns.net:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            login();
            navigate(from, { replace: true });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    const handleSignUpSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            login();
            navigate(from, { replace: true });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="login"> 
            <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUpSubmit}>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i><img src="https://img.icons8.com/?size=100&id=118466&format=png&color=000000" alt="Facebook" /></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i><img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" /></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i><img src="https://img.icons8.com/?size=100&id=98960&format=png&color=000000" alt="LinkedIn" /></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Sign Up</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignInSubmit}>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i><img src="https://img.icons8.com/?size=100&id=118466&format=png&color=000000" alt="Facebook" /></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i><img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" /></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i><img src="https://img.icons8.com/?size=100&id=98960&format=png&color=000000" alt="LinkedIn" /></a>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <a href="#">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
