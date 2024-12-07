import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import '../styles/LoginPage.css';

function Login() {
    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in: ", userCredential.user);
            })
            .catch((error) => console.error(error.message));
    };

    return (
        <body>
            <div className="login-form">
            <form onSubmit={handleLogin}>
                <h1 className="version1-h1">Roomsy.</h1>
                <h2>A space for everyone.</h2>
                
                <div className="login-info">
                    <div className="login-box">
                        <h3>Username</h3>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            required
                        />
                    </div>
                    <div className="login-box">
                        <h3>Password</h3>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            required
                        />
                    </div>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" style={{ color: '#6788ff' }}>Forgot password?</a>
                </div>

                <button type="submit" className="test">Login</button>

                <div className="register-link">
                    <p>Don't have an account?</p>
                    <a href="#" style={{ color: '#6788ff' }}>Register</a>
                </div>
            </form>
        </div>
        </body>
    );
}

export default Login;