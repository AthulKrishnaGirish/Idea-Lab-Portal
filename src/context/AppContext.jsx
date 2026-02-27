import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Initial Mock Data (used only to seed the DB if empty on first load)
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
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  // Restore active login session from local storage so user doesn't have to log in on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('ideaLab_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Sync login session locally
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ideaLab_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ideaLab_user');
    }
  }, [currentUser]);

  // Firestore Real-Time Listeners
  useEffect(() => {
    // Listen to users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Listen to inventory and seed if completely empty
    const unsubscribeInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      if (items.length === 0) {
        INITIAL_INVENTORY.forEach(async (item) => {
          try {
            await setDoc(doc(db, "inventory", item.id), item);
          } catch (e) { console.error("Error seeding DB", e); }
        });
      } else {
        setInventory(items);
      }
    });

    // Listen to requests and order them latest-first
    const unsubscribeRequests = onSnapshot(collection(db, "requests"), (snapshot) => {
      const reqs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      reqs.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      setRequests(reqs);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeInventory();
      unsubscribeRequests();
    };
  }, []);

  // Auth Methods
  const registerUser = async (firstName, lastName, email, password, role) => {
    const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists!' };
    }
    const newUser = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password,
      role
    };
    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      setCurrentUser({ ...newUser, id: docRef.id });
      return { success: true };
    } catch (e) {
      console.error("Firebase Registration Error:", e);
      return { success: false, message: 'Error creating account. (Check browser console for details)' };
    }
  };

  const login = (role, email, password) => {
    const user = users.find(u =>
      (u.email?.toLowerCase() === email.toLowerCase() && u.role === role) ||
      (!u.email && u.username?.toLowerCase() === email.toLowerCase() && u.role === role)
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

  const googleLogin = async (email, firstName, lastName, role) => {
    const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase() && u.role === role);

    if (existingUser) {
      setCurrentUser({ id: existingUser.id, name: existingUser.name, firstName: existingUser.firstName, lastName: existingUser.lastName, email: existingUser.email, role: existingUser.role });
      return { success: true };
    } else {
      const newUser = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password: 'GOOGLE_SSO_USER',
        role
      };

      try {
        const docRef = await addDoc(collection(db, "users"), newUser);
        setCurrentUser({ ...newUser, id: docRef.id });
        return { success: true };
      } catch (e) {
        console.error("Firebase Auth Error:", e);
        return { success: false, message: 'Error creating account with Google. (Check browser console for details)' };
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Inventory Methods
  const addInventoryItem = async (item) => {
    try {
      await addDoc(collection(db, "inventory"), item);
    } catch (e) { console.error("Error adding inventory", e); }
  };

  const updateInventoryItem = async (id, updates) => {
    try {
      await updateDoc(doc(db, "inventory", id), updates);
    } catch (e) { console.error("Error updating inventory", e); }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
    } catch (e) { console.error("Error deleting inventory", e); }
  };

  // Request Methods
  const requestItem = async (studentId, studentName, studentClass, itemId, itemName, need) => {
    const newRequest = {
      studentId,
      studentName,
      studentClass,
      itemId,
      itemName,
      need,
      status: 'pending',
      requestDate: new Date().toISOString(),
      returnDate: null,
      approvedBy: null
    };
    try {
      await addDoc(collection(db, "requests"), newRequest);
    } catch (e) { console.error("Error creating request", e); }
  };

  const updateRequestStatus = async (requestId, status, newReturnDate = null, operatorName = null) => {
    const reqDoc = requests.find(r => r.id === requestId);
    if (!reqDoc) return;

    let returnDate = reqDoc.returnDate;
    let approvedBy = reqDoc.approvedBy;

    // Logic to infer dates and approval author
    if (status === 'approved' && !reqDoc.returnDate) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      returnDate = newReturnDate || date.toISOString();
      approvedBy = operatorName || reqDoc.approvedBy;
    } else if (status === 'approved' && newReturnDate) {
      returnDate = newReturnDate;
      approvedBy = operatorName || reqDoc.approvedBy;
    }

    // Logic to change inventory availability exactly once when approving or returning
    if (status === 'approved' && reqDoc.status === 'pending') {
      const item = inventory.find(i => i.id === reqDoc.itemId);
      if (item) {
        await updateInventoryItem(reqDoc.itemId, { available: item.available - 1 });
      }
    } else if (status === 'returned' && reqDoc.status === 'approved') {
      const item = inventory.find(i => i.id === reqDoc.itemId);
      if (item) {
        await updateInventoryItem(reqDoc.itemId, { available: item.available + 1 });
      }
    }

    try {
      await updateDoc(doc(db, "requests", requestId), {
        status,
        returnDate,
        approvedBy
      });
    } catch (e) { console.error("Error updating request", e); }
  };

  const value = {
    currentUser,
    users,
    inventory,
    requests,
    login,
    googleLogin,
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
