import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Card, FAB, Portal, Modal } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Swipeable } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SIMULATE_ACTIVITIES = [
  { id: "1", name: "Walk", change: 15, category: "Physical" },
  { id: "2", name: "Workout", change: 25, category: "Physical" },
  { id: "3", name: "Meditation", change: 20, category: "Mental"},
  { id: "4", name: "Reading", change: 10, category: "Mental" },
  { id: "5", name: "Work Session", change: -15, category: "Work" },
  { id: "6", name: "Team Meeting", change: -20, category: "Work" },
  { id: "7", name: "Coffee with Friend", change: 12, category: "Social" },
  { id: "8", name: "Late Night Gaming", change: -10, category: "Lifestyle" },
  { id: "9", name: "Social Media", change: -8, category: "Lifestyle"},
  { id: "10", name: "Nap", change: 30, category: "Recovery" },
  { id: "11",name: "Argument", change: -25, category: "Social" },
  { id: "12", name: "Cooking", change: 10, category: "Lifestyle" },
  { id: "13", name: "Family Time", change: 18, category: "Social" },
  { id: "14", name: "Yoga", change: 20, category: "Physical" },
  { id: "15", name: "Netflix Binge", change: -15, category: "Lifestyle" },
  { id: "16", name: "Brainstorming", change: -12, category: "Work" },
  { id: "17", name: "Journaling", change: 12, category: "Mental" },
  { id: "18", name: "Walk", change: 10, category: "Physical" },
  { id: "19", name: "Shopping", change: 5, category: "Lifestyle" },
  { id: "20", name: "Random Act of Kindness", change: 15, category: "Social" },
];

const getEnergyColor = (energy) => {
  if (energy >= 70) return "#2E7D32";
  if (energy >= 30) return "#F9A825";
  return "#C62828";
};

function SimulateScreen() {
  const [simEnergy, setSimEnergy] = useState(100);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const addSimActivity = (activity) => {
    const uniqueItem = { ...activity, uniqueId: Date.now() + Math.random() };
    setSelectedActivities((prev) => [uniqueItem, ...prev]);
    setSimEnergy((prev) => Math.min(100, Math.max(0, prev + activity.change)));
  };

  const deleteSimActivity = (uniqueId) => {
    setSelectedActivities((prev) => {
      const act = prev.find((a) => a.uniqueId === uniqueId);
      if (act)
        setSimEnergy((prevEnergy) =>
          Math.min(100, Math.max(0, prevEnergy - act.change)),
        );
      return prev.filter((a) => a.uniqueId !== uniqueId);
    });
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>PROJECTED ENERGY</Text>
        <Text style={styles.sectionText}>TEST YOUR ENERGY WITH DIFFERENT ACTIVITIES</Text>
        {/* Projected Energy Meter */}
        <View style={styles.energyContainer}>
          <AnimatedCircularProgress
            size={210}
            width={16}
            fill={simEnergy}
            tintColor={getEnergyColor(simEnergy)}
            backgroundColor="#EAEAEA"
            rotation={0}
            lineCap="round"
          >
            {(fill) => (
              <Text style={[styles.energyText, { color: getEnergyColor(fill) }]}>
                {Math.round(fill)}%
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Horizontal Circular Cards */}
        <Text style={styles.sectionTitle}>
          AVAILABLE ACTIVITIES
        </Text>
        <FlatList
          data={SIMULATE_ACTIVITIES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.circleCard}
              onPress={() => addSimActivity(item)}
            >
              <Text style={styles.circleEmoji}>{item.name}</Text>
              <Text
                style={[
                  styles.circleEnergy,
                  { color: item.change >= 0 ? "#2E7D32" : "#C62828" },
                ]}
              >
                {item.change >= 0 ? `+${item.change}` : item.change}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Selected Activities Section */}
        <Text style={styles.sectionTitle}>
          SELECTED ACTIVITIES
        </Text>
        <View>
          {selectedActivities.map((item) => (
            <Swipeable
              key={item.uniqueId}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSimActivity(item.uniqueId)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.cardText}>{item.name}</Text>
                  <Text
                    style={[
                      styles.cardText,
                      { color: item.change >= 0 ? "#2E7D32" : "#C62828" },
                    ]}
                  >
                    {item.change >= 0 ? `+${item.change}` : item.change}
                  </Text>
                </Card.Content>
              </Card>
            </Swipeable>
          ))}
        </View>
      </View>
      </View>
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: "#cec1b1bb",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#cec1b1bb",
  },
  container: { 
    backgroundColor: "#cec1b1bb",
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  topSection: {
    paddingHorizontal: 10,
  },
  energyContainer: { 
    alignItems: "center",
    marginBottom: 32,
    marginTop: 2,
  },
  energyText: {
    fontSize: 40,
    fontFamily: "Montserrat_400Regular",
  },
  sectionTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Montserrat_400Regular",
    color: "#75624b",
    letterSpacing: 2,
  },
    sectionText: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 20,
    marginTop: -12,
    color: "#75624b",
    textAlign: "center",
    letterSpacing: 2,
  },
  circleCard: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#EAEAEA",
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  circleEmoji: {
    fontSize: 16,
    textAlign: "center",
  },
  circleEnergy: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    marginBottom: 2,
    borderRadius: 0,
    backgroundColor: "#EAEAEA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: { 
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "#75624b",
    letterSpacing: 2,
  },
  deleteButton: {
    backgroundColor: '#c34343ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 5,
    marginBottom: 1,
    marginTop:1,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
});

export default SimulateScreen