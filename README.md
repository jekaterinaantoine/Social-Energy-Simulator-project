# ⚡ Boost&Burn — Social Energy Simulator
A mobile app built with React Native and Expo that helps you track your daily energy levels, log activities, and understand what boosts or drains you throughout the day.

---

## 📱 Features

### Home Screen
- **Morning mood check-in** — set your starting energy level (Amazing / Good / Okay / Tired / Exhausted) at the beginning of each day
- **Live energy circle** — animated circular meter showing your current energy in EP (Energy Points), colour-coded green / yellow / red
- **Activity log** — add activities from a preset list and watch your energy update in real time
- **Swipe to delete** — remove an activity by swiping left on it
- **Energy label** — shows a status like *Energized 🔥*, *Balanced 🌿*, *Low 🌙*, or *Drained 😴*

### Simulate Screen
- **What-if playground** — test how a combination of activities would affect your energy without committing to them
- Same animated energy circle, same 0–100 EP scale
- Add and remove activities freely to explore different scenarios

### Insights Screen
- **Today's direction** — net energy impact (↑ or ↓) from all logged activities
- **Top boosters** — your top 3 energy-gaining activities of the day
- **Top drainers** — your top 3 energy-costing activities of the day

### Welcome Screen
- Animated splash screen shown once on app launch

---

## 🧮 How Energy Works

- You start each day by picking a mood, which sets your base energy (20–95 EP)
- Each activity adds or subtracts a fixed number of EP
- Your mood and activities are saved locally and persist through the day

---

## 🛠️ Built With

| Library | Purpose |
|---|---|
| [Expo](https://expo.dev/) | App framework & build tooling |
| [React Native](https://reactnative.dev/) | UI framework |
| [react-native-paper](https://callstack.github.io/react-native-paper/) | UI components (Cards, Modals, FAB) |
| [react-native-circular-progress](https://github.com/bgryszko/react-native-circular-progress) | Animated energy circle |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Local data persistence |
| [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) | Swipe-to-delete gestures |
| [Montserrat](https://fonts.google.com/specimen/Montserrat) | Custom font via Expo Google Fonts |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your phone, or an Android/iOS simulator

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-username/energy-tracker.git
cd energy-tracker

# Install dependencies
npm install

# Start the app
npm expo start
```

Then scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.
