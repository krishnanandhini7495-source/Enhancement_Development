// src/screens/HomeScreen.tsx
// Dashboard Home Screen with Stats and Quick Actions

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="currency-inr" size={32} color="#10b981" />
          <Text style={styles.statValue}>₹0</Text>
          <Text style={styles.statLabel}>Today's Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="receipt" size={32} color="#3b82f6" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Today's Bills</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="account-group" size={32} color="#f59e0b" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="shopping" size={32} color="#ef4444" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Low Stock Items</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="receipt" size={40} color="#6366f1" />
            <Text style={styles.actionText}>New Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="content-cut" size={40} color="#6366f1" />
            <Text style={styles.actionText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="shopping" size={40} color="#6366f1" />
            <Text style={styles.actionText}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="account-multiple" size={40} color="#6366f1" />
            <Text style={styles.actionText}>Staff</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
});

export default HomeScreen;
