import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

function InsightsScreen({ activitiesLog = [] }) {
  // Calculate boosters, drainers, and total impact
  const insights = useMemo(() => {
    const boosters = activitiesLog
      .filter((a) => a.energyChange > 0)
      .sort((a, b) => b.energyChange - a.energyChange)
      .slice(0, 3);

    const drainers = activitiesLog
      .filter((a) => a.energyChange < 0)
      .sort((a, b) => a.energyChange - b.energyChange)
      .slice(0, 3);

    const totalImpact = activitiesLog.reduce(
      (sum, a) => sum + a.energyChange,
      0,
    );

    return { boosters, drainers, totalImpact };
  }, [activitiesLog]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>YOUR ENERGY PATTERNS</Text>
      <Text style={styles.subtitle}>
        NOTICE WHAT LIFTS YOU - AND WHAT QUIETLY DRAINS YOU
      </Text>

      {/* Energy Trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>TODAY'S DIRECTION</Text>
        <Text
          style={[
            styles.bigNumber,
            insights.totalImpact >= 0 ? styles.positive : styles.negative,
          ]}
        >
          {insights.totalImpact >= 0 ? "↑" : "↓"} {insights.totalImpact}
        </Text>
      </View>

      {/* Top Boosters */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>TOP BOOSTERS 👍</Text>
        {insights.boosters.length === 0 ? (
          <Text style={styles.empty}>Nothing yet</Text>
        ) : (
          insights.boosters.map((item, i) => (
            <Text key={i} style={styles.positive}>
              {item.name} +{item.energyChange}
            </Text>
          ))
        )}
      </View>

      {/* Top Drainers */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>TOP DRAINERS 👎</Text>
        {insights.drainers.length === 0 ? (
          <Text style={styles.empty}>All good</Text>
        ) : (
          insights.drainers.map((item, i) => (
            <Text key={i} style={styles.negative}>
              {item.name} {item.energyChange}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cec1b1bb",
    padding: 20,
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Montserrat_700Bold",
    color: "#75624b",
    letterSpacing: 2,
  },

  subtitle: {
    textAlign: "center",
    color: "#75624b",
    marginBottom: 20,
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    letterSpacing: 2,
  },

  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontFamily: "Montserrat_700Bold",
    marginBottom: 10,
    color: "#75624b",
    fontSize: 16,
    letterSpacing: 2,
  },

  bigNumber: {
    fontSize: 40,
    textAlign: "center",
  },

  positive: {
    color: "#467948ff",
    marginBottom: 6,
    fontFamily: "Montserrat_400Regular",
  },

  negative: {
    color: "#c34343ff",
    marginBottom: 6,
    fontFamily: "Montserrat_400Regular",
  },

  empty: {
    opacity: 0.5,
    fontFamily: "Montserrat_400Regular",
  },
});

export default InsightsScreen;
