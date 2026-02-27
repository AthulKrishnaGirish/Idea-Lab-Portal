import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Send, Clock, PackageCheck } from 'lucide-react';

const StudentDashboard = () => {
    const { inventory, requests, currentUser, requestItem } = useAppContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [needDescription, setNeedDescription] = useState('');
    const [studentClass, setStudentClass] = useState('');

    const myRequests = requests.filter(req => req.studentId === currentUser.id);

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem || !needDescription.trim()) return;

        requestItem(
            currentUser.id,
            currentUser.name,
            studentClass,
            selectedItem.id,
            selectedItem.name,
            needDescription
        );

        setSelectedItem(null);
        setNeedDescription('');
        setStudentClass('');
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>

            {/* Left Column: Inventory */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Available Components</h2>
                    <div className="input-group" style={{ marginBottom: 0, width: '300px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search items..."
                                style={{ paddingLeft: '2.5rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {filteredInventory.map(item => (
                        <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <PackageCheck size={40} color="var(--text-muted)" />
                                    </div>
                                )}
                            </div>

                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>{item.category}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span style={{ fontSize: '0.9rem', color: item.available > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                    {item.available} available
                                </span>

                                <button
                                    onClick={() => setSelectedItem(item)}
                                    disabled={item.available === 0}
                                    className={`btn ${selectedItem?.id === item.id ? 'btn-secondary' : 'btn-primary'}`}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                                >
                                    {selectedItem?.id === item.id ? 'Selected' : 'Borrow'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Request Form & History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Request Form */}
                <div className="glass-panel" style={{ border: selectedItem ? '1px solid var(--secondary)' : '' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Send size={20} color="var(--primary)" /> Request Item
                    </h3>

                    {selectedItem ? (
                        <form onSubmit={handleRequestSubmit}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Requesting Item:</p>
                                        <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{selectedItem.name}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Requesting As:</p>
                                        <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{currentUser.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Your Class / Batch</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    placeholder="E.g., CS5A, EC7B..."
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Why do you need this component?</label>
                                <textarea
                                    className="input-field"
                                    rows="3"
                                    required
                                    placeholder="E.g., For final year robotics project..."
                                    value={needDescription}
                                    onChange={(e) => setNeedDescription(e.target.value)}
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Request</button>
                                <button type="button" onClick={() => setSelectedItem(null)} className="btn btn-secondary" style={{ padding: '0.75rem' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                            Select an item from the inventory to request it.
                        </p>
                    )}
                </div>

                {/* Borrowed Items & Requests */}
                <div className="glass-panel">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                        <Clock size={20} /> Borrowed Items & Requests
                    </h3>

                    {myRequests.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't requested any items yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myRequests.map(req => (
                                <div key={req.id} style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--border-light)',
                                    padding: '1rem',
                                    borderRadius: '10px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h4 style={{ fontSize: '1rem' }}>{req.itemName}</h4>
                                        <span className={`badge badge-${req.status}`}>{req.status}</span>
                                    </div>

                                    {req.returnDate && req.status === 'approved' && (
                                        <div style={{ padding: '0.75rem', background: 'rgba(251, 192, 45, 0.1)', border: '1px solid rgba(251, 192, 45, 0.3)', borderRadius: '8px', marginTop: '0.75rem' }}>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                                <Clock size={16} /> Return Due Date:
                                            </div>
                                            <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 'bold', marginTop: '0.25rem', paddingLeft: '1.75rem' }}>
                                                {new Date(req.returnDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            {req.approvedBy && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', paddingLeft: '1.75rem', fontWeight: '500' }}>
                                                    Approved by {req.approvedBy}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {req.status === 'returned' && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                            Item returned successfully.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;
