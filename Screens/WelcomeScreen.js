import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Animated } from "react-native";

const WelcomeScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();

    // Auto-finish after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/pics/logo.avif")} // full-screen wallpaper image
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Text style={styles.title}>ENERGY TRACKER</Text>
        <Text style={styles.subtitle}>Track your daily energy & activities</Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Montserrat_700Bold",
    color: "#75624b",
    textAlign: "center",
    letterSpacing:2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "#75624b",
    marginTop: 10,
    textAlign: "center",
    letterSpacing:2,
  },
});

export default WelcomeScreen;