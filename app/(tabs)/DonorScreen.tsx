import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '@/lib/firebase'; // Ensure you have your Firebase setup correctly

const db = getFirestore();

// Define the interface for donors
interface Donor {
  id: string;
  name: string;
  phoneNumber: string;
  bloodGroup: string;
  medicalHistory: string;
  status: string; // Add status field
}

export default function DonorScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]); // Type the donors state variable
  const [isRegistered, setIsRegistered] = useState(false); // State to check if user is registered

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'donors'), snapshot => {
      const donorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donor[];
      setDonors(donorsData);

      // Check if the current user is already registered
      const currentUserId = auth.currentUser?.uid;
      if (currentUserId) {
        const userDonor = donorsData.find(donor => donor.id === currentUserId);
        setIsRegistered(!!userDonor); // Set registration status
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDonorSubmit = async () => {
    // Prevent submission if already registered
    if (isRegistered) {
      Alert.alert("Registration Error", "You are already registered as a donor.");
      return;
    }

    try {
      await addDoc(collection(db, 'donors'), {
        id: auth.currentUser?.uid, // Use user ID as the document ID
        name,
        phoneNumber,
        bloodGroup,
        medicalHistory,
        status: 'Pending', // Default status
        createdAt: new Date(),
      });
      Alert.alert("Registration Successful", "Your registration as a donor is submitted and is pending approval.");
      // Clear input fields
      setName('');
      setPhoneNumber('');
      setBloodGroup('');
      setMedicalHistory('');
    } catch (error) {
      Alert.alert("Error", "There was an error submitting your registration.");
    }
  };

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <Text style={styles.title}>You are already registered as a donor.</Text>
      ) : (
        <>
          <Text style={styles.title}>Register as a Donor</Text>
          <ScrollView style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              value={bloodGroup}
              onChangeText={setBloodGroup}
              placeholder="Blood Group"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.input}
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              placeholder="Past Medical History"
              placeholderTextColor="black"
            />
            <Pressable style={styles.button} onPress={handleDonorSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </ScrollView>
        </>
      )}

      <Text style={styles.title}>Registered Donors</Text>
      <ScrollView style={styles.donorList}>
        {donors.map(donor => (
          <View key={donor.id} style={styles.donorCard}>
            <Text style={styles.donorName}>{donor.name}</Text>
            <Text style={styles.donorDetails}>Phone: {donor.phoneNumber}</Text>
            <Text style={styles.donorDetails}>Blood Group: {donor.bloodGroup}</Text>
            <Text style={styles.donorDetails}>Status: {donor.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5F6D',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#FF5F6D',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF5F6D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  donorList: {
    marginTop: 20,
  },
  donorCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  donorName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FF5F6D',
  },
  donorDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 