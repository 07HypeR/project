import { Tabs } from 'expo-router';
import { Chrome as Home, MapPin, MessageCircle, User, Bell, Angry, House, Heart } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        },
        tabBarActiveTintColor: '#FF5F6D',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <House size={size} color={color} />
            // <Home
            // size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="DonorScreen"
        options={{
          title: 'Donor',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      
    
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}