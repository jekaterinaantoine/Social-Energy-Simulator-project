import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SIMULATE_ACTIVITIES = [
  { id: "1", name: "Walk", change: 15, category: "Physical" },
  { id: "2", name: "Workout", change: 25, category: "Physical" },
  { id: "3", name: "Meditation", change: 20, category: "Mental" },
  { id: "4", name: "Reading", change: 10, category: "Mental" },
  { id: "5", name: "Work Session", change: -15, category: "Work" },
  { id: "6", name: "Team Meeting", change: -20, category: "Work" },
  { id: "7", name: "Coffee with Friend", change: 12, category: "Social" },
  { id: "8", name: "Late Night Gaming", change: -10, category: "Lifestyle" },
  { id: "9", name: "Social Media", change: -8, category: "Lifestyle" },
  { id: "10", name: "Nap", change: 30, category: "Recovery" },
  { id: "11", name: "Argument", change: -25, category: "Social" },
  { id: "12", name: "Cooking", change: 10, category: "Lifestyle" },
  { id: "13", name: "Family Time", change: 18, category: "Social" },
  { id: "14", name: "Yoga", change: 20, category: "Physical" },
  { id: "15", name: "Netflix Binge", change: -15, category: "Lifestyle" },
  { id: "16", name: "Brainstorming", change: -12, category: "Work" },
  { id: "17", name: "Journaling", change: 12, category: "Mental" },
  { id: "18", name: "Walk", change: 10, category: "Physical" },
  { id: "19", name: "Shopping", change: 5, category: "Lifestyle" },
  { id: "20", name: "Act of Kindness", change: 15, category: "Social" },
];

const getEnergyColor = (energy) => {
  if (energy >= 70) return "#467948ff";
  if (energy >= 30) return "#fabf62ff";
  return "#c34343ff";
};

function SimulateScreen() {
  const [baseEnergy, setBaseEnergy] = useState(100);
  const [simEnergy, setSimEnergy] = useState(100);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    const loadEnergy = async () => {
      const storedBase = await AsyncStorage.getItem("baseEnergy");

      if (storedBase !== null) {
        const parsed = parseInt(storedBase);
        setBaseEnergy(parsed);
        setSimEnergy(parsed);
      }
    };

    loadEnergy();
  }, []);

  const addSimActivity = (activity) => {
    const newItem = {
      ...activity,
      uniqueId: `${activity.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    };
    setSelectedActivities((prev) => {
      const updated = [newItem, ...prev];

      const totalChange = updated.reduce((sum, item) => sum + item.change, 0);

      const newEnergy = Math.min(100, Math.max(0, baseEnergy + totalChange));

      setSimEnergy(newEnergy);

      return updated;
    });
  };

  const deleteSimActivity = (uniqueId) => {
    setSelectedActivities((prev) => {
      const updated = prev.filter((item) => item.uniqueId !== uniqueId);

      const totalChange = updated.reduce((sum, item) => sum + item.change, 0);

      const newEnergy = Math.min(100, Math.max(0, baseEnergy + totalChange));

      setSimEnergy(newEnergy);

      return updated;
    });
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>PROJECTED ENERGY</Text>
          <Text style={styles.sectionText}>
            TEST YOUR ENERGY WITH DIFFERENT ACTIVITIES
          </Text>
          {/* Projected Energy Meter */}
          <View style={styles.energyContainer}>
            <AnimatedCircularProgress
              size={160}
              width={10}
              fill={simEnergy}
              tintColor={getEnergyColor(simEnergy)}
              backgroundColor="#EAEAEA"
              rotation={0}
              lineCap="round"
            >
              {(fill) => (
                <Text
                  style={[styles.energyText, { color: getEnergyColor(fill) }]}
                >
                  {Math.round(fill)}%
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>

          {/* Horizontal Circular Cards */}
          <Text style={styles.sectionTitle}>AVAILABLE ACTIVITIES</Text>
          <FlatList
            data={SIMULATE_ACTIVITIES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.circleCard}
                onPress={() => addSimActivity(item)}
              >
                <Text style={styles.circleText}>{item.name}</Text>
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
          <Text style={styles.sectionTitle}>SELECTED ACTIVITIES</Text>
          <View>
            {selectedActivities.length == 0 && (
              <View style={styles.emptyPlaceholder}>
                <Text style={styles.emptyText}>No activities selected at the moment.</Text>
                <Text style={styles.emptyText}>Select from activites above.</Text>
              </View>
            )}
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
      </ScrollView>
    </View>
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
    paddingTop: 20,
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
    flex: 1,
  },
  energyText: {
    fontSize: 30,
    fontFamily: "Montserrat_400Regular",
  },
  sectionTitle: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Montserrat_700Bold",
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EAEAEA",
    marginHorizontal: 2,
    marginTop: -10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  circleText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    color: "#75624b",
    justifyContent:'center',
  },
  circleEnergy: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
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
    backgroundColor: "#c34343ff",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 5,
    marginBottom: 1,
    marginTop: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  emptyPlaceholder: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -24,
  },
  emptyText: {
    color: "#75624b",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
  },
});

export default SimulateScreen;
