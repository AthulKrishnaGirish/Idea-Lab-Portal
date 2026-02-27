import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircle, ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, registerUser, googleLogin } = useAppContext();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('student');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const { email, given_name, family_name } = decoded;

            const result = await googleLogin(email, given_name || '', family_name || '', role, isLogin);
            if (!result.success) {
                setError(result.message);
            } else {
                navigate(`/${role}-dashboard`);
            }
        } catch (err) {
            setError('Failed to securely log in with Google.');
            console.error(err);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login window closed or failed.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = login(role, email, password);
            if (!result.success) {
                setError(result.message);
            } else {
                navigate(`/${role}-dashboard`);
            }
        } else {
            if (!firstName.trim() || !lastName.trim() || !email.trim()) {
                setError('First Name, Last Name, and Email are all required for registration.');
                return;
            }
            const result = await registerUser(firstName, lastName, email, password, role);
            if (!result.success) {
                setError(result.message);
            } else {
                navigate(`/${role}-dashboard`);
            }
        }
    };

    return (
        <div className="app-container" style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundImage: 'url("/college-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Dark overlay for the background image */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 17, 40, 0.85)', zIndex: 0 }}></div>

            <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '90%', margin: '0 auto', position: 'relative', zIndex: 1, padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <img src="/cognicor.png" alt="CogniCor Logo" style={{ height: 'auto', maxHeight: '45px', maxWidth: '30%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/aicte.png" alt="AICTE Logo" style={{ height: 'auto', maxHeight: '50px', maxWidth: '30%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/idealab.png" alt="IDEA Lab Logo" style={{ height: 'auto', maxHeight: '60px', maxWidth: '30%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/mec.png" alt="MEC Logo" style={{ height: 'auto', maxHeight: '50px', maxWidth: '30%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="nav-brand" style={{ justifyContent: 'center', fontSize: '1.8rem', background: 'white', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', lineHeight: '1.2' }}>
                        CogniCor AICTE IDEA Lab
                    </h1>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                    <button
                        className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, borderRadius: '8px 8px 0 0', borderBottom: isLogin ? '2px solid var(--primary)' : 'none' }}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, borderRadius: '8px 8px 0 0', borderBottom: !isLogin ? '2px solid var(--primary)' : 'none' }}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '5px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Account Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ flex: 1 }}
                                onClick={() => setRole('student')}
                            >
                                <UserCircle size={18} /> Student
                            </button>
                            <button
                                type="button"
                                className={`btn ${role === 'operator' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ flex: 1 }}
                                onClick={() => setRole('operator')}
                            >
                                <ShieldAlert size={18} /> Operator
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            <div className="input-group" style={{ marginTop: '1.5rem' }}>
                                <label className="input-label">First Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Last Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        </>
                    )}

                    <div className="input-group" style={{ marginTop: isLogin ? '1.5rem' : '0' }}>
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                        {isLogin ? 'Access System' : 'Create Account & Login'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                        <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>OR CONTINUE WITH</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            width="100%"
                            text={isLogin ? "signin_with" : "signup_with"}
                            shape="rectangular"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
