import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircle, ShieldAlert } from 'lucide-react';

const Login = () => {
    const { login, registerUser } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('student');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = login(role, email, password);
            if (!result.success) {
                setError(result.message);
            }
        } else {
            if (!firstName.trim() || !lastName.trim() || !email.trim()) {
                setError('First Name, Last Name, and Email are all required for registration.');
                return;
            }
            const result = registerUser(firstName, lastName, email, password, role);
            if (!result.success) {
                setError(result.message);
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

            <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 1, padding: '3rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <img src="/cognicor.png" alt="CogniCor Logo" style={{ height: '55px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/aicte.png" alt="AICTE Logo" style={{ height: '65px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/idealab.png" alt="IDEA Lab Logo" style={{ height: '75px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <img src="/mec.png" alt="MEC Logo" style={{ height: '65px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                </form>
            </div>
        </div>
    );
};

export default Login;
