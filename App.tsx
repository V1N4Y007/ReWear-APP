import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, Platform } from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import SwapsScreen from './src/screens/SwapsScreen';
import AdminScreen from './src/screens/AdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Colors, Shadow } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon helper using emoji (no native icon lib needed)
const TabIcon = ({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) => (
  <View style={{ alignItems: 'center', paddingTop: 4 }}>
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
    <Text style={{
      fontSize: 10,
      fontWeight: focused ? '700' : '500',
      color: focused ? Colors.primary : Colors.textSecondary,
      marginTop: 2,
    }}>
      {label}
    </Text>
  </View>
);

// Main bottom tab navigator (after login)
const MainTabs = () => {
  const { user } = useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 6,
          backgroundColor: Colors.card,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          ...Shadow.lg,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="Swaps"
        component={SwapsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔄" label="Swaps" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }}
      />
      {user?.role === 'admin' && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" label="Admin" focused={focused} /> }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNav = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {/* Main app with bottom tabs */}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            {/* Stack screens pushed on top of tabs */}
            <Stack.Screen
              name="AddItem"
              component={AddItemScreen}
              options={{
                headerShown: true,
                title: 'List an Item',
                headerStyle: { backgroundColor: Colors.card },
                headerTintColor: Colors.textPrimary,
              }}
            />
            <Stack.Screen
              name="ItemDetail"
              component={ItemDetailScreen}
              options={{
                headerShown: true,
                title: 'Item Details',
                headerStyle: { backgroundColor: Colors.card },
                headerTintColor: Colors.textPrimary,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}