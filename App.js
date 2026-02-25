import React, { useState, useEffect } from "react";
import { BottomNavigation, Text, Provider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
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

const App = () => {
  const [someData, setSomeData] = useState("banana");

  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // state with active route and labels/icons for routes
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // update route index in state
  const handleIndexChange = (index) => setState({ ...state, index });

  // linking keys from state to routes
  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    simulate: SimulateScreen,
    insights: InsightsScreen,
  });

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
