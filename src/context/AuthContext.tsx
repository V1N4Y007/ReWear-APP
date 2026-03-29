import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { getFCMToken, requestPermission } from '../services/FCMService';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (e) {
      console.log('Error checking token', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    // Attempt to get FCM Token
    await requestPermission();
    const fcmToken = await getFCMToken();

    const response = await api.post('/auth/login', { email, password, fcmToken });
    const { token, ...userData } = response.data;
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    // Attempt to get FCM Token
    await requestPermission();
    const fcmToken = await getFCMToken();

    const response = await api.post('/auth/register', { name, email, password, fcmToken });
    const { token, ...userData } = response.data;
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
