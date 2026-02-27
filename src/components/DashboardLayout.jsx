import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, Package, Users, LayoutDashboard, Database } from 'lucide-react';

const DashboardLayout = () => {
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src="/cognicor.png" alt="CogniCor Logo" style={{ height: '35px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        <img src="/aicte.png" alt="AICTE Logo" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        <img src="/idealab.png" alt="IDEA Lab Logo" style={{ height: '45px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        <img src="/mec.png" alt="MEC Logo" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>CogniCor AICTE IDEA Lab</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem'
                        }}>
                            <Users size={16} color="var(--secondary)" />
                            <span>{currentUser?.name}</span>
                            <span className={`badge ${currentUser?.role === 'operator' ? 'badge-approved' : 'badge-pending'}`} style={{ marginLeft: '0.5rem' }}>
                                {currentUser?.role}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            {currentUser?.role === 'operator' && (
                <div style={{ padding: '1rem 2rem', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                    <Link to="/" className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/inventory" className={`btn ${location.pathname === '/inventory' ? 'btn-primary' : 'btn-secondary'}`}>
                        <Database size={18} /> Manage Inventory
                    </Link>
                </div>
            )}

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
