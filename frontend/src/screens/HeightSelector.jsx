import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import WheelPicker from "react-native-wheely";

const { width } = Dimensions.get('window');

const HeightSelector = () => {
  const [selectedHeight, setSelectedHeight] = useState(175);
  const heightOptions = Array.from({ length: 101 }, (_, i) => 100 + i);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s Your Height</Text>
      <Text style={styles.subtitle}>"CM"</Text>

      <View style={styles.wheelWrapper}>
        {/* Selected Indicator */}
        <View style={styles.selectedIndicatorTop} />
        <View style={styles.selectedIndicatorBottom} />

        {/* Height Selector */}
        <View style={styles.wheelContainer}>
          <WheelPicker
            selectedIndex={selectedHeight - 100}
            options={heightOptions.map(String)}
            onChange={(index) => setSelectedHeight(heightOptions[index])}
            itemTextStyle={styles.wheelText}
            selectedIndicatorStyle={{ backgroundColor: "transparent" }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate("WeightSelection", { height: selectedHeight })}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 18,
    color: "#AAAAAA",
    marginBottom: 25,
    letterSpacing: 1,
  },
  wheelWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  wheelContainer: {
    height: 250,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  wheelText: {
    fontSize: 26,
    color: "#AAAAAA",
    fontWeight: "600",
  },
  selectedIndicatorTop: {
    position: "absolute",
    top: "40%", // Adjusted for perfect centering
    width: 150,
    height: 2,
    backgroundColor: "#FEC400",
    zIndex: 1,
  },
  selectedIndicatorBottom: {
    position: "absolute",
    top: "58%", // Adjusted for perfect centering
    width: 150,
    height: 2,
    backgroundColor: "#FEC400",
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  backButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 38,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FEC400",
    marginRight: 20,
  },
  nextButton: {
    backgroundColor: "#FEC400",
    paddingVertical: 16,
    paddingHorizontal: 38,
    borderRadius: 18,
  },
  backButtonText: {
    fontSize: 18,
    color: "#FEC400",
    fontWeight: "bold",
  },
  nextButtonText: {
    fontSize: 18,
    color: "#1E1E1E",
    fontWeight: "bold",
  },
});

export default HeightSelector;
