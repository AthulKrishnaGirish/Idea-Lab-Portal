import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Calendar, RefreshCw } from 'lucide-react';

const OperatorDashboard = () => {
    const { requests, updateRequestStatus, inventory, currentUser } = useAppContext();
    const [editingDate, setEditingDate] = useState(null);
    const [tempDate, setTempDate] = useState('');
    const [approvalDates, setApprovalDates] = useState({});

    const handleApprove = (reqId) => {
        updateRequestStatus(reqId, 'approved', null, currentUser?.name);
    };

    const handleReject = (reqId) => {
        updateRequestStatus(reqId, 'rejected');
    };

    const handleReturn = (reqId) => {
        updateRequestStatus(reqId, 'returned');
    };

    const saveDate = (reqId) => {
        updateRequestStatus(reqId, 'approved', new Date(tempDate).toISOString(), currentUser?.name);
        setEditingDate(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <h2>Operator Dashboard</h2>
                <div className="badge badge-pending full-width-mobile" style={{ fontSize: '1rem', padding: '0.5rem 1rem', textAlign: 'center' }}>
                    {requests.filter(r => r.status === 'pending').length} Pending Requests
                </div>
            </div>

            <div className="glass-panel">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={20} /> Borrowing Requests
                </h3>

                {requests.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No requests at this time.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {requests.map(req => {
                            const itemInfo = inventory.find(i => i.id === req.itemId);

                            return (
                                <div key={req.id} style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--border-light)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '1.1rem' }}>{req.itemName}</h4>
                                            <span className={`badge badge-${req.status}`}>{req.status}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            <strong>Requested by:</strong> {req.studentName} {req.studentClass ? `(${req.studentClass})` : ''}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <strong>Need:</strong> {req.need}
                                        </p>
                                        {req.approvedBy && (
                                            <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '500' }}>
                                                ✓ Approved by {req.approvedBy}
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>

                                        {req.status === 'pending' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', width: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Set Return Date:</label>
                                                    <input
                                                        type="date"
                                                        className="input-field"
                                                        style={{ padding: '0.35rem', height: 'auto', background: 'rgba(0,0,0,0.5)', width: 'auto' }}
                                                        value={approvalDates[req.id] || ''}
                                                        onChange={(e) => setApprovalDates({ ...approvalDates, [req.id]: e.target.value })}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => {
                                                        const dateVal = approvalDates[req.id];
                                                        if (dateVal) {
                                                            updateRequestStatus(req.id, 'approved', new Date(dateVal).toISOString(), currentUser?.name);
                                                        } else {
                                                            updateRequestStatus(req.id, 'approved', null, currentUser?.name); // Defaults to 7 days
                                                        }
                                                    }} className="btn btn-success" style={{ padding: '0.5rem' }}>
                                                        <CheckCircle size={18} /> Approve
                                                    </button>
                                                    <button onClick={() => handleReject(req.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                                        <XCircle size={18} /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {req.status === 'approved' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--warning)' }}>
                                                    <Calendar size={16} />
                                                    {editingDate === req.id ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <input
                                                                type="date"
                                                                className="input-field"
                                                                style={{ padding: '0.25rem', height: 'auto', background: 'rgba(0,0,0,0.5)' }}
                                                                value={tempDate}
                                                                onChange={(e) => setTempDate(e.target.value)}
                                                            />
                                                            <button onClick={() => saveDate(req.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>Save</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            Due: {new Date(req.returnDate).toLocaleDateString()}
                                                            <button
                                                                onClick={() => {
                                                                    setEditingDate(req.id);
                                                                    setTempDate(req.returnDate ? req.returnDate.split('T')[0] : '');
                                                                }}
                                                                className="btn btn-secondary"
                                                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                                            >
                                                                Edit
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                                <button onClick={() => handleReturn(req.id)} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                                                    Mark as Returned
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatorDashboard;
