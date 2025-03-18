import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplets, MapPin, Phone, CircleAlert as AlertCircle } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen'; // Import the ProfileScreen
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { auth } from '@/lib/firebase'; // Ensure you have your Firebase setup correctly
import DonorScreen from './DonorScreen'; // Import the DonorScreen
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Tab = createBottomTabNavigator();
const db = getFirestore();

// Define the interface for blood requests
interface BloodRequest {
  id: string;
  name: string;
  bloodGroup: string;
  hospitalAddress: string;
  hospitalName: string;
  completed: boolean; // New field to track if the request is completed
  registrationNumber: string; // New field for registration number
  phoneNumber: string; // Add PhoneNumber field
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [regNumber, setRegNumber] = useState(''); // New state for registration number
  const [inputRegNumber, setInputRegNumber] = useState(''); // State for input registration number
  const [validationMessage, setValidationMessage] = useState(''); // State for validation message
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bloodRequests'), snapshot => {
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BloodRequest[];
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);

  const generateRegistrationNumber = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString(); // Generate a unique 7-digit number
  };

  const handleRequestSubmit = async () => {
    try {
      const registrationNumber = generateRegistrationNumber(); // Generate registration number
      await addDoc(collection(db, 'bloodRequests'), {
        name,
        bloodGroup,
        hospitalAddress,
        hospitalName,
        phoneNumber, // Include phone number in the request
        createdAt: new Date(),
        completed: false, // Default to false
        registrationNumber, // Store the registration number
      });
      Alert.alert("Request Submitted", "Your blood request has been submitted successfully.");
      setModalVisible(false);
      // Clear input fields
      setName('');
      setBloodGroup('');
      setHospitalAddress('');
      setHospitalName('');
      setPhoneNumber(''); // Clear phone number
    } catch (error) {
      Alert.alert("Error", "There was an error submitting your request.");
    }
  };

  const completeRequest = async (request: BloodRequest) => {
    try {
      const requestRef = doc(db, 'bloodRequests', request.id);
      await updateDoc(requestRef, { completed: true });

      const userId = auth.currentUser?.uid; // Get the user ID
      if (userId) { // Check if user is authenticated
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          livesSaved: increment(1), // Increment lives saved
          donationCount: increment(1), // Increment donation count
        });

        Alert.alert("Request Completed", "Thank you for saving a life!");
      } else {
        Alert.alert("Error", "User is not authenticated.");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error completing the request.");
    }
  };

  const validateRegistrationNumber = async () => {
    const request = requests.find(req => req.registrationNumber === inputRegNumber);
    if (request) {
      setValidationMessage("Registration number is valid! Request completed successfully.");
      // Optionally, you can also mark the request as completed here
      await completeRequest(request);
    } else {
      setValidationMessage("Invalid registration number.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF5F6D', '#FFC371']}
        style={styles.header}
      >
        <Text style={styles.greeting}>Welcome to Blood Donation App!</Text>
        <Text style={styles.subtitle}>Ready to save lives today?</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.head}>
        To get your registration number, you can send a photo of your successful blood donation on WhatsApp at  9366159066
      </Text>
      
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard} onPress={() => setModalVisible(true)}>
            <Droplets size={24} color="#FF5F6D" />
            <Text style={styles.actionText}>Request Blood</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('DonorScreen')}>
            <MapPin size={24} color="#FF5F6D" />
            <Text style={styles.actionText}>Find Donors</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => Linking.openURL('tel:102')}>
            <Phone size={24} color="#FF5F6D" />
            <Text style={styles.actionText}>Emergency</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <AlertCircle size={24} color="#FF5F6D" />
            <Text style={styles.actionText}>Request</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Nearby Requests</Text>
        {requests.length > 0 ? (
          requests.map(request => (
            <View key={request.id} style={[styles.requestCard, request.completed ? styles.completedCard : styles.pendingCard]}>
              <Text style={styles.requestTitle}>{request.name}</Text>
              <Text style={styles.requestTitle}>Phone Number: {request.phoneNumber}</Text>
              <Text style={styles.requestDetails}>Blood Group: {request.bloodGroup}</Text>
              <Text style={styles.requestDetails}>Hospital: {request.hospitalName}</Text>
              <Text style={styles.requestDetails}>Address: {request.hospitalAddress}</Text>
              <Text style={styles.requestStatus}>{request.completed ? "Completed" : "Pending"}</Text>
              {!request.completed && (
                <>
                  <TextInput
                    style={styles.modalInput}
                    value={regNumber}
                    onChangeText={setRegNumber}
                    placeholder="Registration Number"
                    placeholderTextColor="black"
                  />
                  <Pressable style={styles.modalButton} onPress={() => completeRequest(request)}>
                    <Text style={styles.modalButtonText}>Complete Request</Text>
                  </Pressable>
                </>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noRequestsText}>No nearby requests available.</Text>
        )}

        <Text style={styles.sectionTitle}>Validate Registration Number</Text>
        <TextInput
          style={styles.modalInput}
          value={inputRegNumber}
          onChangeText={setInputRegNumber}
          placeholder="Enter Registration Number"
          placeholderTextColor="black"
        />
        <Pressable style={styles.modalButton} onPress={validateRegistrationNumber}>
          <Text style={styles.modalButtonText}>Validate</Text>
        </Pressable>
        {validationMessage ? (
          <Text style={styles.validationMessage}>{validationMessage}</Text>
        ) : null}
      </ScrollView>

      {/* Modal for Blood Request Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Blood</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={bloodGroup}
              onChangeText={setBloodGroup}
              placeholder="Blood Group"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={hospitalName}
              onChangeText={setHospitalName}
              placeholder="Hospital Name"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={hospitalAddress}
              onChangeText={setHospitalAddress}
              placeholder="Hospital Address"
              placeholderTextColor="black"
            />
            <TextInput
              style={styles.modalInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              placeholderTextColor="black"
            />
            <Pressable style={styles.modalButton} onPress={handleRequestSubmit}>
              <Text style={styles.modalButtonText}>Submit Request</Text>
            </Pressable>
            <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15, // Larger size for emphasis
    color: 'red',
    textAlign: 'center',
    textTransform: 'uppercase', // Stylish uppercase text
    letterSpacing: 2, // Adds spacing between letters
    textShadowColor: 'rgba(255, 0, 0, 0.6)', // Soft red glow
    textShadowOffset: { width: 2, height: 2 }, // Subtle 3D effect
    textShadowRadius: 4, // Smooth glow effect
    paddingVertical: 10, // Adds space above and below
    borderBottomWidth: 3, // Creates a stylish underline
    borderBottomColor: 'red', // Matches text color
    fontStyle: 'italic', // Adds a unique touch
    opacity: 0.9, // Slight transparency for a modern look
},


  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FF5F6D',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
  },
  requestCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  completedCard: {
    backgroundColor: '#D4EDDA', // Light green for completed
  },
  pendingCard: {
    backgroundColor: '#F8D7DA', // Light red for pending
  },
  requestTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FF5F6D',
  },
  requestDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  requestStatus: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginTop: 8,
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
    fontFamily: 'Poppins-Bold',
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
    fontFamily: 'Poppins-SemiBold',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FF5F6D',
    fontFamily: 'Poppins-SemiBold',
  },
  validationMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FF5F6D',
    marginTop: 10,
    textAlign: 'center',
  },
  noRequestsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});

export function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Donors" component={DonorScreen} />
    </Tab.Navigator>
  );
}