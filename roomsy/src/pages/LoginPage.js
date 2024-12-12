import React, { useState} from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successful");
            navigate('/dashboard');
        }
        catch(err) {
            console.log(err);
            if (err.code === "auth/invalid-credential") {
                alert("Login unsuccessful: Invalid credentials");
            }
            else {
                alert("Login unsuccessful. Please try again.");
            }
        }
        
    };

    return (
        <div className="body-group">
        <>
            <div className="login-form">
            <form onSubmit={handleLogin}>
                <h1 className="version1-h1">Roomsy✨</h1>
                <h2 className="version1-h2">A space for everyone</h2>
                
                <div className="login-info">
                    <div className="login-box">
                        <h3>Username</h3>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            required
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-box">
                        <h3>Password</h3>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" style={{ color: '#8da4f7' }}>Forgot password?</a>
                </div>

                <button type="submit" id="test">Login</button>

                <div className="register-link">
                    <p>Don't have an account?</p>
                    <a href="/signup" style={{ color: '#8da4f7' }}>Sign Up</a>
                </div>
            </form>
            </div>


        <div className="logo">
            <img src = "/images/roomsy_icon2.png" alt = "A corner model of a room with a bed" align="right" width="500px"/>
        </div>
        </>
        </div>
    );
}

export default Login;