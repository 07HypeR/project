import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal, Animated } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase'; // Ensure you have your Firebase setup correctly

const db = getFirestore();

// Define the interface for user data
interface User {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<User>({ name: '', email: '', phoneNumber: '', address: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedData, setUpdatedData] = useState<User>({ name: '', email: '', phoneNumber: '', address: '' });
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity value

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as User; // Cast to User interface
          setUserData(data);
          setUpdatedData(data); // Initialize updatedData with current user data
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { ...updatedData }); // Spread updatedData to pass as key-value pairs
        Alert.alert("Profile Updated", "Your profile has been updated successfully.");
        setUserData(updatedData); // Update local state with new data
        setModalVisible(false); // Close the modal
      } catch (error) {
        Alert.alert("Error", "There was an error updating your profile.");
      }
    }
  };

  // Animation for modal
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {userData.name}</Text>
      <Text style={styles.label}>Email: {userData.email}</Text>
      <Text style={styles.label}>Phone: {userData.phoneNumber}</Text>
      <Text style={styles.label}>Address: {userData.address}</Text>
      <Pressable style={styles.editButton} onPress={showModal}>
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>

      

      {/* Modal for Editing Profile */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedData.name}
              onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
              placeholder="Your Name"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={updatedData.email}
              onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
              placeholder="Email"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={updatedData.phoneNumber}
              onChangeText={(text) => setUpdatedData({ ...updatedData, phoneNumber: text })}
              placeholder="Phone Number"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={updatedData.address}
              onChangeText={(text) => setUpdatedData({ ...updatedData, address: text })}
              placeholder="Address"
              placeholderTextColor="black"
            />
            <Pressable style={styles.modalButton} onPress={handleUpdate}>
              <Text style={styles.modalButtonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.modalCloseButton} onPress={hideModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 40,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5F6D',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#FF5F6D',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    color: '#FF5F6D',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 50,
    borderColor: '#FF5F6D',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#FF5F6D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FF5F6D',
    fontWeight: 'bold',
  },
}); 