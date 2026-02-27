import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial Mock Data
const INITIAL_INVENTORY = [
  { id: 'item-1', name: 'Arduino Uno R3', category: 'Microcontrollers', quantity: 15, available: 15, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-2', name: 'Raspberry Pi 4', category: 'Microcomputers', quantity: 5, available: 3, imageUrl: 'https://images.unsplash.com/photo-1587302912306-cf1ed9c33146?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-3', name: 'Jumper Wires (M-M)', category: 'Components', quantity: 50, available: 45, imageUrl: 'https://images.unsplash.com/photo-1620247526705-9008272fbd72?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-4', name: 'Breadboard', category: 'Components', quantity: 20, available: 18, imageUrl: 'https://images.unsplash.com/photo-1608564697071-f0911b93f1f7?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-5', name: 'ESP32 Development Board', category: 'Microcontrollers', quantity: 10, available: 10, imageUrl: 'https://images.unsplash.com/photo-1594814887372-9a367d3b2ec6?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-6', name: 'Ultrasonic Distance Sensor (HC-SR04)', category: 'Sensors', quantity: 20, available: 20, imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-7', name: 'PIR Motion Sensor', category: 'Sensors', quantity: 15, available: 15, imageUrl: 'https://images.unsplash.com/photo-1631557088916-22a009bc2eb8?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-8', name: 'Temperature & Humidity Sensor (DHT11)', category: 'Sensors', quantity: 25, available: 25, imageUrl: 'https://images.unsplash.com/photo-1580828369019-2238c92a9526?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-9', name: '16x2 LCD Display', category: 'Displays', quantity: 10, available: 10, imageUrl: 'https://images.unsplash.com/photo-1593344601445-6c7000cedff6?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-10', name: '9V Battery & Clip', category: 'Power', quantity: 30, available: 30, imageUrl: 'https://images.unsplash.com/photo-1594944474327-14e30b3dd1d2?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-11', name: 'Servo Motor (SG90)', category: 'Actuators', quantity: 12, available: 12, imageUrl: 'https://images.unsplash.com/photo-1620283085439-3f6262b9a7be?auto=format&fit=crop&q=80&w=200' },
  { id: 'item-12', name: '5V Relay Module (1 Channel)', category: 'Modules', quantity: 15, available: 15, imageUrl: 'https://images.unsplash.com/photo-1533235658826-61327c5fbab8?auto=format&fit=crop&q=80&w=200' },
];

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState(null); // { id, name, username, role: 'student' | 'operator' }
  const [users, setUsers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('ideaLab_inventory');
    const savedRequests = localStorage.getItem('ideaLab_requests');
    const savedUser = localStorage.getItem('ideaLab_user');
    const savedUsers = localStorage.getItem('ideaLab_users');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    if (savedInventory) {
      const parsedInventory = JSON.parse(savedInventory);
      // Ensure existing items have the updated images
      const mergedInventory = parsedInventory.map(item => {
        const initialMatch = INITIAL_INVENTORY.find(i => i.id === item.id);
        return initialMatch ? { ...item, imageUrl: initialMatch.imageUrl } : item;
      });
      setInventory(mergedInventory);
    } else {
      setInventory(INITIAL_INVENTORY);
      localStorage.setItem('ideaLab_inventory', JSON.stringify(INITIAL_INVENTORY));
    }

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to LocalStorage whenstate changes
  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem('ideaLab_inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ideaLab_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('ideaLab_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ideaLab_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ideaLab_user');
    }
  }, [currentUser]);

  // Auth Methods
  const registerUser = (firstName, lastName, email, password, role) => {
    const existingUser = users.find(u =>
      (u.email?.toLowerCase() === email.toLowerCase())
    );

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists!' };
    }
    const newUser = {
      id: `${role === 'operator' ? 'op' : 'stu'}-${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password,
      role
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Auto login
    return { success: true };
  };

  const login = (role, email, password) => {
    // Check if user exists and password matches
    const user = users.find(u =>
      (u.email?.toLowerCase() === email.toLowerCase() && u.role === role) ||
      (!u.email && u.username?.toLowerCase() === email.toLowerCase() && u.role === role) // Backward compat for initial users
    );

    if (!user) {
      return { success: false, message: 'Account not found. Please check your credentials or switch to "Sign Up".' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setCurrentUser({ id: user.id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Inventory Methods
  const addInventoryItem = (item) => {
    setInventory(prev => [...prev, { ...item, id: `item-${Date.now()}` }]);
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Request Methods
  const requestItem = (studentId, studentName, studentClass, itemId, itemName, need) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      studentId,
      studentName,
      studentClass, // New field Added
      itemId,
      itemName,
      need,
      status: 'pending', // pending, approved, rejected, returned
      requestDate: new Date().toISOString(),
      returnDate: null,
      approvedBy: null // New field to track who approved
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (requestId, status, newReturnDate = null, operatorName = null) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        let returnDate = req.returnDate;
        let approvedBy = req.approvedBy;

        // Auto-generate return date if approving and none exists
        if (status === 'approved' && !req.returnDate) {
          const date = new Date();
          date.setDate(date.getDate() + 7); // Default 7 days
          returnDate = newReturnDate || date.toISOString();
          approvedBy = operatorName || req.approvedBy; // Track Operator
        } else if (status === 'approved' && newReturnDate) {
          returnDate = newReturnDate;
          approvedBy = operatorName || req.approvedBy;
        }

        // Handle inventory logic based on status change
        if (status === 'approved' && req.status === 'pending') {
          // Decrement available
          updateInventoryItem(req.itemId, { available: inventory.find(i => i.id === req.itemId).available - 1 });
        } else if (status === 'returned' && req.status === 'approved') {
          // Increment available
          updateInventoryItem(req.itemId, { available: inventory.find(i => i.id === req.itemId).available + 1 });
        }

        return { ...req, status, returnDate, approvedBy };
      }
      return req;
    }));
  };

  const value = {
    currentUser,
    users,
    inventory,
    requests,
    login,
    logout,
    registerUser,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    requestItem,
    updateRequestStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
