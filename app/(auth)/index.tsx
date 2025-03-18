import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

export default function AuthScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Heart pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={['#D4145A', '#FF4E50']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <Heart size={80} color="white" strokeWidth={1.5} />
        </Animated.View>
        <Text style={styles.title}>Raktdaan Setu Tripura</Text>
        <Text style={styles.subtitle}>Connecting hearts, saving lives</Text>

        <View style={styles.buttonContainer}>
          <Link href="/(auth)/ReceiverLoginScreen" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.signInButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={[styles.buttonText, styles.signInText]}>
                Sign In
              </Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/ReceiverRegisterScreen" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.signUpButton,
                pressed && styles.pressedButtonOutline,
              ]}
            >
              <Text style={[styles.buttonText, styles.signUpText]}>
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/(auth)/ReceiverLoginScreen" style={styles.linkText}>
            Log In
          </Link>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 34,
    color: '#FFFDE7', // Softer white for visibility
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#FFDDC1', // Warmer contrast
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  signInButton: {
    backgroundColor: '#FFFDE7', // Soft yellow-white
  },
  signInText: {
    color: 'white',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFDE7',
  },
  signUpText: {
    color: '#FFFDE7',
  },
  pressedButton: {
    backgroundColor: '#FAE3D9',
  },
  pressedButtonOutline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    marginTop: 20,
    color: '#FFFDE7',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  linkText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
