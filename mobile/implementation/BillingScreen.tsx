// src/screens/BillingScreen.tsx
// Billing Screen - Create New Invoices

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BillingScreen = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [discount, setDiscount] = useState('0');

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const productsTotal = selectedProducts.reduce((sum, p) => sum + p.total, 0);
    const subtotal = servicesTotal + productsTotal;
    const discountAmount = parseFloat(discount) || 0;
    return subtotal - discountAmount;
  };

  const handleSaveBill = () => {
    if (!customerName || !customerPhone) {
      Alert.alert('Error', 'Please enter customer details');
      return;
    }

    if (selectedServices.length === 0 && selectedProducts.length === 0) {
      Alert.alert('Error', 'Please select at least one service or product');
      return;
    }

    // TODO: Integrate with invoicesAPI.createInvoice()
    Alert.alert('Success', 'Bill saved successfully');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Customer Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
        {selectedServices.length === 0 ? (
          <Text style={styles.emptyText}>No services selected</Text>
        ) : (
          selectedServices.map((service, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemName}>{service.name}</Text>
              <Text style={styles.itemPrice}>₹{service.price}</Text>
            </View>
          ))
        )}
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
        {selectedProducts.length === 0 ? (
          <Text style={styles.emptyText}>No products selected</Text>
        ) : (
          selectedProducts.map((product, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemName}>{product.name}</Text>
              <Text style={styles.itemPrice}>₹{product.total}</Text>
            </View>
          ))
        )}
      </View>

      {/* Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            ₹{calculateTotal() + (parseFloat(discount) || 0)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount:</Text>
          <TextInput
            style={styles.discountInput}
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹{calculateTotal()}</Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveBill}>
        <Icon name="check" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>Save Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  addButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  emptyText: {
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#1e293b',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  discountInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    width: 100,
    textAlign: 'right',
    fontSize: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BillingScreen;
