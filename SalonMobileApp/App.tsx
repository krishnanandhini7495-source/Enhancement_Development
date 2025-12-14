// App.tsx
// Root Application Component with Redux Provider and Navigation

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import { getToken, getUser } from './utils/storage';
import { setUserFromStorage } from './store/slices/authSlice';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and user on app startup
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        const user = await getUser();

        if (token && user) {
          // Restore auth state from storage
          store.dispatch(setUserFromStorage({ token, user }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
