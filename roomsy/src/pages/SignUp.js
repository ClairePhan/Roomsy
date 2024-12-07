import React, { useState } from 'react';
import '../styles/SignUp.css';
import {auth} from '../services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account Created")
            alert("Account successfully created");
        }
        catch (error) {
            console.log(error)
            if (error.code === "auth/email-already-in-use") {
                alert("The email address is already in use. Please use a different email.");
            }
        }
    }

    return (
        <>
            <div className="signup-form">
                <form onSubmit={handleSignup}>
                    <h2>Sign Up</h2>

                    <div className="signup-info">
                        <div className="signup-box">
                            <h3>Username</h3>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                required
                                onChange = { (e) => setEmail(e.target.value) }
                            />
                        </div>
                        <div className="signup-box">
                            <h3>Password</h3>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password..."
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="forgotPassword">
                            <a href="#" style={{ color: '#6788ff' }}>Forgot password?</a>
                        </div>

                        <button type="submit" className="test">Sign Up</button> 
                        <div className="register-link">
                            <p>Already have an account?</p>
                            <a href="/" style={{ color: '#6788ff' }}>Login</a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignUp