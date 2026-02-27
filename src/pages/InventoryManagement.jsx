import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PlusCircle, Edit, Trash2, Box } from 'lucide-react';

const InventoryManagement = () => {
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 0,
        imageUrl: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Need to adjust available quantity relative to total quantity change
            const oldItem = inventory.find(i => i.id === editingId);
            const diff = parseInt(formData.quantity) - oldItem.quantity;

            updateInventoryItem(editingId, {
                ...formData,
                quantity: parseInt(formData.quantity),
                available: oldItem.available + diff
            });
            setEditingId(null);
        } else {
            addInventoryItem({
                ...formData,
                quantity: parseInt(formData.quantity),
                available: parseInt(formData.quantity)
            });
            setIsAdding(false);
        }

        setFormData({ name: '', category: '', quantity: 0, imageUrl: '' });
    };

    const editItem = (item) => {
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            imageUrl: item.imageUrl
        });
        setEditingId(item.id);
        setIsAdding(true);
    };

    return (
        <div className="animate-fade-in">
            <div className="stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <h2>Inventory Management</h2>
                <button
                    onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                    className={`full-width-mobile ${isAdding ? "btn btn-secondary" : "btn btn-primary"}`}
                >
                    {isAdding ? 'Cancel' : <><PlusCircle size={18} /> Add Item</>}
                </button>
            </div>

            {isAdding && (
                <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                        {editingId ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Component Name</label>
                            <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Category</label>
                            <input type="text" className="input-field" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Total Quantity</label>
                            <input type="number" min="0" className="input-field" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Image URL</label>
                            <input type="url" className="input-field" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                                {editingId ? 'Update Item' : 'Save Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {inventory.map(item => (
                    <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box size={40} color="var(--text-muted)" />
                                </div>
                            )}
                        </div>

                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{item.category}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.quantity}</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border-light)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available</div>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: item.available > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                    {item.available}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button onClick={() => editItem(item)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                                <Edit size={16} /> Edit
                            </button>
                            <button onClick={() => deleteInventoryItem(item.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryManagement;
