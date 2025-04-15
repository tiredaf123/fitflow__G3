import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 70;

const AgeSelection = () => {
  const [selectedAge, setSelectedAge] = useState(25);  // Default Age
  const ageOptions = Array.from({ length: 83 }, (_, i) => 18 + i);  // Ages from 18 to 100
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setSelectedAge(ageOptions[index]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's Your Age</Text>
      <Text style={styles.subtitle}>"Years"</Text>

      {/* Age Selector */}
      <View style={styles.wheelWrapper}>
        {/* Indicator Arrow */}
        <View style={styles.indicator}>
          <Icon name="arrow-drop-down" size={30} color="#FEC400" />
        </View>

        <FlatList
          ref={flatListRef}
          data={ageOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          onScroll={handleScroll}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  item === selectedAge && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </View>
          )}
          initialScrollIndex={ageOptions.indexOf(selectedAge)}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
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
          onPress={() => navigation.navigate('HeightSelector', { age: selectedAge })}
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
    width: width,
    alignItems: "center",
    marginBottom: 30,
  },
  indicator: {
    position: "absolute",
    top: -20,
    zIndex: 2,
  },
  listContainer: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    paddingVertical: 20,
  },
  item: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 22,
    color: "#AAAAAA",
  },
  selectedText: {
    color: "#FEC400",
    fontSize: 28,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 40,
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

export default AgeSelection;
