import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadStreakUser = async () => {
      try {
        const storedStreakUser = await AsyncStorage.getItem('currentUser');
        if (storedStreakUser) {
          setUser(JSON.parse(storedStreakUser));
        }
      } catch (error) {
        console.error('Error loading storedStreakUser data:', error);
      }
    };
    loadStreakUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
