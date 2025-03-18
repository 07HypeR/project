import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'; // Import necessary functions
import { auth } from '@/lib/firebase'; // Ensure you have your Firebase setup correctly

// Define the interface for the request data
interface BloodRequest {
  id: string;
  latitude: number;
  longitude: number;
  bloodType: string;
  description: string;
}

export default function BloodRequestMapScreen() {
  const [requests, setRequests] = useState<BloodRequest[]>([]); // Type the state variable
  const db = getFirestore(); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bloodRequests'), snapshot => {
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BloodRequest[]; // Type assertion
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <MapView style={{ flex: 1 }}>
      {requests.map(request => (
        <Marker
          key={request.id}
          coordinate={{ latitude: request.latitude, longitude: request.longitude }}
          title={request.bloodType}
          description={request.description}
        />
      ))}
    </MapView>
  );
} 