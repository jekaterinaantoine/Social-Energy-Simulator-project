import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Easing,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  FAB,
  Modal,
  Portal,
  TextInput,
  Button,
} from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";

const ACTIVITY_OPTIONS = [
  { id: "1", name: "🌅 Morning Walk", change: 15, category: "Physical" },
  { id: "2", name: "💪 Workout", change: 25, category: "Physical" },
  {
    id: "3",
    name: "🪷 Meditation & Mindfulness",
    change: 20,
    category: "Mental",
  },
  { id: "4", name: "📖 Reading a Book", change: 10, category: "Mental" },
  { id: "5", name: "💻 Deep Work Session", change: -15, category: "Work" },
  { id: "6", name: "🤝 Team Meeting", change: -20, category: "Work" },
  { id: "7", name: "☕️ Coffee with Friend", change: 12, category: "Social" },
  { id: "8", name: "🎮 Late Night Gaming", change: -10, category: "Lifestyle" },
  {
    id: "9",
    name: "📱 Scrolling Social Media",
    change: -8,
    category: "Lifestyle",
  },
  { id: "10", name: "😴 Quick Power Nap", change: 30, category: "Recovery" },
  {
    id: "11",
    name: "🗣️ Friendly Debate / Argument",
    change: -25,
    category: "Social",
  },
  { id: "12", name: "🍳 Cooking a Meal", change: 10, category: "Lifestyle" },
  { id: "13", name: "👨‍👩‍👧‍👦 Family Time", change: 18, category: "Social" },
  { id: "14", name: "🧘 Yoga", change: 20, category: "Physical" },
  { id: "15", name: "📺 Netflix Binge", change: -15, category: "Lifestyle" },
  { id: "16", name: "💡 Brainstorm & Ideas", change: -12, category: "Work" },
  { id: "17", name: "📝 Journaling", change: 12, category: "Mental" },
  { id: "18", name: "🚶 Evening Walk", change: 10, category: "Physical" },
  { id: "19", name: "🛍️ Shopping", change: 5, category: "Lifestyle" },
  {
    id: "20",
    name: "❤️ Random Act of Kindness",
    change: 15,
    category: "Social",
  },
];

const getEnergyColor = (energy) => {
  if (energy >= 70) return "#467948ff";
  if (energy >= 40) return "#fabf62ff";
  return "#c34343ff";
};

// Start from the base mood, then apply each activity in order.
// Clamp after every step so energy never goes above 100 or below 0.
const calcEnergy = (base, activities) => {
  let energy = base;
  for (let i = activities.length - 1; i >= 0; i--) {
    energy = energy + (activities[i].energyChange || 0);
    if (energy > 100) energy = 100;
    if (energy < 0) energy = 0;
  }
  return energy;
};

const screenHeight = Dimensions.get("window").height;

const HomeScreen = ({ setTodayActivities }) => {
  const [energy, setEnergy] = useState(0);
  const [baseEnergy, setBaseEnergy] = useState(0);
  const [activities, setActivities] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const maxEnergyAnim = useRef(new Animated.Value(0)).current;
  const [showMaxEnergy, setShowMaxEnergy] = useState(false);

  const moods = [
    { label: "😎 Amazing", value: 95 },
    { label: "😊 Good", value: 80 },
    { label: "🙂 Okay", value: 60 },
    { label: "😴 Tired", value: 40 },
    { label: "😫 Don't even ask me!", value: 20 },
  ];

  useEffect(() => {
    const loadData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const savedDate = await AsyncStorage.getItem("lastMoodDate");
      const savedBase = await AsyncStorage.getItem("baseEnergy");
      const savedActivities = await AsyncStorage.getItem("todayActivities");

      if (savedDate === today && savedBase) {
        const parsedBase = parseInt(savedBase);
        setBaseEnergy(parsedBase);

        const parsedActivities = savedActivities
          ? JSON.parse(savedActivities)
          : [];
        setActivities(parsedActivities);

        setEnergy(calcEnergy(parsedBase, parsedActivities));
        setShowMoodModal(false);
      } else {
        setShowMoodModal(true);
        setActivities([]);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (energy === 100) {
      setShowMaxEnergy(true);
      maxEnergyAnim.setValue(0);
      Animated.timing(maxEnergyAnim, {
        toValue: 1.1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => setShowMaxEnergy(false));
    }
  }, [energy]);

  const addActivity = (name, change) => {
    const newActivity = {
      id: Date.now().toString(),
      name,
      energyChange: change,
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    AsyncStorage.setItem("todayActivities", JSON.stringify(updatedActivities));

    if (setTodayActivities) setTodayActivities(updatedActivities);

    setEnergy(calcEnergy(baseEnergy, updatedActivities));
  };

  const deleteActivity = (id) => {
    setActivities((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      AsyncStorage.setItem("todayActivities", JSON.stringify(updated));
      if (setTodayActivities) setTodayActivities(updated);

      setEnergy(calcEnergy(baseEnergy, updated));
      return updated;
    });
  };

  const getEnergyLabel = (energy) => {
    if (energy <= 30)
      return { label: "DRAINED 😴", message: "Go gently today" };
    if (energy <= 60)
      return { label: "LOW 🌙", message: "Protect your energy" };
    if (energy <= 80)
      return { label: "BALANCED 🌿", message: "Nice flow so far" };
    return { label: "ENERGIZED 🔥", message: "You're on fire today" };
  };

  const energyState = getEnergyLabel(energy);

  const maxEnergyStyle = {
    opacity: maxEnergyAnim,
    transform: [
      {
        translateY: maxEnergyAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
    ],
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>YOUR CURRENT ENERGY LEVEL</Text>
            <Text style={styles.sectionText}>
              TRACK YOUR ENERGY AND TODAY'S ACTIVITIES
            </Text>
            <Text style={styles.energyFeeling}>
              Feeling: {energyState.label}
            </Text>

            {/* Energy Meter */}
            <View style={styles.energyContainer}>
              <AnimatedCircularProgress
                size={210}
                width={16}
                fill={energy}
                tintColor={getEnergyColor(energy)}
                backgroundColor="#EAEAEA"
                rotation={0}
                lineCap="round"
                duration={600}
              >
                {(fill) => {
                  let emoji = "⚡"; // default
                  if (fill >= 70) emoji = "💚";
                  else if (fill >= 30) emoji = "💛";
                  else emoji = "❤️";
                  return (
                    <Text
                      style={[
                        styles.energyText,
                        { color: getEnergyColor(fill) },
                      ]}
                    >
                      {emoji} {Math.round(fill)}%
                    </Text>
                  );
                }}
              </AnimatedCircularProgress>
              {showMaxEnergy && (
                <Animated.Text style={[styles.maxEnergyText, maxEnergyStyle]}>
                  YOU ARE AT YOUR PEAK
                </Animated.Text>
              )}
            </View>

            <Text style={styles.energyMessage}>{energyState.message}</Text>

            {/* Today’s Activities */}
            <Text style={styles.sectionTitle}>TODAY'S MOVES</Text>
            <View>
              {activities.length === 0 && (
                <View style={styles.emptyPlaceholder}>
                  <Text style={styles.emptyText}>
                    NO ACTIVITIES SELECTED AT THE MOMENT
                  </Text>
                  <View style={styles.emptyContent}>
                    <Text style={styles.emptyQuestion}>BOOST OR BURN?</Text>
                    <Image
                      source={require("../assets/pics/smirk.png")}
                      style={styles.image}
                    />
                  </View>
                </View>
              )}
              {activities.map((item) => (
                <Swipeable
                  key={item.id}
                  renderRightActions={() => (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteActivity(item.id)}
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
                          {
                            color:
                              item.energyChange >= 0 ? "#2E7D32" : "#C62828",
                          },
                        ]}
                      >
                        {item.energyChange >= 0
                          ? `+${item.energyChange}`
                          : item.energyChange}
                      </Text>
                    </Card.Content>
                  </Card>
                </Swipeable>
              ))}
            </View>

            {/* Activity Modal */}
            <Portal>
              <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                contentContainerStyle={styles.modal}
              >
                <Text style={styles.modalTitle}>CHOOSE YOUR ACTIVITY</Text>
                <View style={styles.modalListContainer}>
                  <FlatList
                    data={ACTIVITY_OPTIONS}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                      <Text
                        style={styles.modalActivityItem}
                        onPress={() => {
                          addActivity(item.name, item.change);
                          setVisible(false);
                        }}
                      >
                        {item.name}{" "}
                        {item.change >= 0 ? `+${item.change}` : item.change}
                      </Text>
                    )}
                  />
                </View>
              </Modal>
            </Portal>

            {/* Mood Modal */}
            <Portal>
              <Modal
                visible={showMoodModal}
                contentContainerStyle={styles.modal}
              >
                <Text style={styles.modalTitle}>HOW IS YOUR ENERGY TODAY?</Text>
                <View style={styles.modalListContainer}>
                  <FlatList
                    data={moods}
                    keyExtractor={(item) => item.value.toString()}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                      <Text
                        style={styles.modalActivityItem}
                        onPress={async () => {
                          const today = new Date().toISOString().split("T")[0];
                          setBaseEnergy(item.value);
                          setEnergy(item.value);

                          await AsyncStorage.setItem("lastMoodDate", today);
                          await AsyncStorage.setItem(
                            "baseEnergy",
                            item.value.toString(),
                          );
                          await AsyncStorage.setItem(
                            "todayActivities",
                            JSON.stringify([]),
                          );

                          setShowMoodModal(false);
                        }}
                      >
                        {item.label}
                      </Text>
                    )}
                  />
                </View>
              </Modal>
            </Portal>
          </View>
        </ScrollView>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setVisible(true)}
          color="#75624b"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#cec1b1bb",
  },

  container: {
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 20,
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  energyContainer: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 0,
  },

  energyText: {
    fontSize: 40,
    fontFamily: "Montserrat_700Bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 20,
    color: "#75624b",
    textAlign: "center",
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

  card: {
    marginBottom: 1,
    borderRadius: 0,
    backgroundColor: "#EAEAEA",
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

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#F7F7F7",
    elevation: 8, // Android shadow

    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  modal: {
    backgroundColor: "#e9e2dabb",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 16,
    color: "#75624b",
    letterSpacing: 2,
  },

  modalListContainer: {
    maxHeight: 400,
    marginTop: 10,
  },

  modalActivityItem: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#75624b",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#75624b",
  },

  optionCard: {
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#EAEAEA",
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
    paddingVertical: 0,
  },
  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#75624b",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    marginTop: -14,
    textAlign: "center",
    letterSpacing: 2,
  },
  emptyQuestion: {
    color: "#75624b",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 6,
    marginTop: 50,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  energyFeeling: {
    color: "#75624b",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 6,
    textAlign: "center",
  },
  energyMessage: {
    color: "#75624b",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 46,
    textAlign: "center",
  },
  maxEnergyText: {
    position: "absolute",
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    color: "#467948ff",
  },
});

export default HomeScreen;
