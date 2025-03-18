import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function ReceiverRegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const db = getFirestore();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: '', // Initialize with empty values or default values
        address: '',
        phoneNumber: '',
        bloodGroup: '',
      });

      router.push('/(tabs)'); // Redirect to tab index page
    } catch (error) {
      const firebaseError = error as FirebaseError;
      Alert.alert("Registration Error", firebaseError.message);
    }
  };

  return (
    <LinearGradient colors={['#FF5F6D', '#FFC371']} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5F6D',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5F6D',
    marginBottom: 5,
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
}); 