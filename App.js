import React, { useState, useEffect } from "react";
import { BottomNavigation, Provider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

import HomeScreen from "./Screens/HomeScreen";
import SimulateScreen from "./Screens/SimulateScreen";
import InsightsScreen from "./Screens/InsightsScreen";
import WelcomeScreen from "./Screens/WelcomeScreen";

const App = () => {
  // Shared state: today’s activities, used by Home & Insights
  const [todayActivities, setTodayActivities] = useState([]);
  // Welcome screen visibility
  const [showWelcome, setShowWelcome] = useState(true);

  //Fonts and splash screen handling
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Hide splash as soon as fonts are ready (or font loading failed)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Bottom navigation state
  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: "home", title: "Home", focusedIcon: "home" },
      {
        key: "simulate",
        title: "Simulate",
        focusedIcon: "lightning-bolt-outline",
      },
      { key: "insights", title: "Insights", focusedIcon: "chart-line" },
    ],
  });

  // Prevent render until fonts are available
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Update selected tab
  const handleIndexChange = (index) => setState({ ...state, index });

  // Scene mapping: wires navigation tabs to screen components
  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen setTodayActivities={setTodayActivities} />,
    simulate: SimulateScreen,
    insights: () => <InsightsScreen activitiesLog={todayActivities} />,
  });

  // Show welcome screen first, if enabled
  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <BottomNavigation
              navigationState={state}
              onIndexChange={handleIndexChange}
              renderScene={renderScene}
              activeIndicatorStyle={{ backgroundColor: "#ffffffff" }}
              shifting={false}
              barStyle={{
                backgroundColor: "#ffffffff",
                borderTopWidth: 0.5,
                borderTopColor: "#75624b",
                height: 80,
              }}
              activeColor="#75624ba7"
              inactiveColor="#75624b"
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
