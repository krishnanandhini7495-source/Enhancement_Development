// src/screens/StaffScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StaffScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Staff Screen - Implementation Pending</Text>
      <Text style={styles.subtext}>Follow ServicesScreen.tsx pattern</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  subtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
});

export default StaffScreen;
