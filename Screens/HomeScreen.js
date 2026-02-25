import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Card, FAB, Modal, Portal, TextInput, Button } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const ACTIVITY_OPTIONS = [
  { id: '1', name: '🌅 Morning Walk', change: 15, category: 'Physical' },
  { id: '2', name: '💪 Workout', change: 25, category: 'Physical' },
  { id: '3', name: '🧘 Meditation & Mindfulness', change: 20, category: 'Mental' },
  { id: '4', name: '📖 Reading a Book', change: 10, category: 'Mental' },
  { id: '5', name: '💻 Deep Work Session', change: -15, category: 'Work' },
  { id: '6', name: '🤝 Team Meeting', change: -20, category: 'Work' },
  { id: '7', name: '☕️ Coffee with Friend', change: 12, category: 'Social' },
  { id: '8', name: '🎮 Late Night Gaming', change: -10, category: 'Lifestyle' },
  { id: '9', name: '📱 Scrolling Social Media', change: -8, category: 'Lifestyle' },
  { id: '10', name: '😴 Quick Power Nap', change: 30, category: 'Recovery' },
  { id: '11', name: '🗣️ Friendly Debate / Argument', change: -25, category: 'Social' },
  { id: '12', name: '🍳 Cooking a Meal', change: 10, category: 'Lifestyle' },
  { id: '13', name: '👨‍👩‍👧‍👦 Family Time', change: 18, category: 'Social' },
  { id: '14', name: '🧘 Yoga', change: 20, category: 'Physical' },
  { id: '15', name: '📺 Netflix Binge', change: -15, category: 'Lifestyle' },
  { id: '16', name: '💡 Brainstorm & Ideas', change: -12, category: 'Work' },
  { id: '17', name: '📝 Journaling', change: 12, category: 'Mental' },
  { id: '18', name: '🚶 Evening Walk', change: 10, category: 'Physical' },
  { id: '19', name: '🛍️ Shopping', change: 5, category: 'Lifestyle' },
  { id: '20', name: '❤️ Random Act of Kindness', change: 15, category: 'Social' },
];

const getEnergyColor = (energy) => {
  if (energy >= 70) return '#467948ff';
  if (energy >= 40) return '#fabf62ff'; 
  return '#c34343ff'; 
};

const screenHeight = Dimensions.get('window').height;


const HomeScreen = () => {

    const [energy, setEnergy] = useState(65) // energy value 0-100%

    const [activities, setActivities] = useState([]);
    
    const [visible, setVisible] = useState(false);
    
    const addActivity = (name, change) => {
        setEnergy(prev =>
            Math.min(100, Math.max(0, prev + change)))
            
            const newActivity = {
            id: Date.now().toString(),
            name,
            energyChange: change,
        }
        setActivities(prev => [newActivity, ...prev])
    };

  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

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
        >
            {(fill) => (
            <Text style={[styles.energyText, { color: getEnergyColor(fill) }]}>
                  {Math.round(fill)}%
                </Text>
              )}
        </AnimatedCircularProgress>
      </View>

       {/* Today’s Activities */}
      <Text style={styles.sectionTitle}>What I did today</Text>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text
                style={[
                  styles.cardText,
                  { color: item.energyChange >= 0 ? '#387C3C' : '#B23B3B' },
                ]}
              >
                {item.energyChange >= 0 ? '+' : ''}
                {item.energyChange}
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
        color="#75624b"
      />

   <Portal>
  <Modal
    visible={visible}
    onDismiss={() => setVisible(false)}
    contentContainerStyle={styles.modal}
  >
    <Text style={styles.modalTitle}>Choose Your Activity</Text>

    <View style={styles.modalListContainer}>
      <FlatList
        data={ACTIVITY_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.modalActivityItem}
            onPress={() => {
              addActivity(item.name, item.change);
              setVisible(false);
            }}
          >
            {item.name} {item.change >= 0 ? `+${item.change}` : item.change}
          </Text>
        )}
      />
    </View>
  </Modal>
</Portal>
</View>
</SafeAreaView>
</SafeAreaProvider>
)
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#cec1b1bb',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  energyContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  energyText: {
    fontSize: 40,
    fontFamily: 'Montserrat_400Regular',
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 12,
    color: '#75624b',
    textAlign: "center",
    letterSpacing: 2,
  },

  card: {
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#75624b',
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#75624b',
    letterSpacing: 2,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#F7F7F7',
  },

  modal: {
    backgroundColor: '#e9e2dabb',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 16,
    color: '#75624b',
  },

  modalListContainer: {
    maxHeight: 400, // Adjust: shows roughly 6-8 items, scroll for the rest
    marginTop: 10,
},

  modalActivityItem: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#75624b',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#75624b',
},

  optionCard: {
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
});

export default HomeScreen