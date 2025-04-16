import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../BottomTabBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_KEY = 'TAAhwPUwDc+8lJBgm8FYdg==dB5FaijgpOK45xY3';
const API_URL = 'https://api.api-ninjas.com/v1/exercises';
const TIMER_DURATION = 300; // 5 minutes in seconds

const muscleOptions = [
  { label: 'Biceps', value: 'biceps' },
  { label: 'Chest', value: 'chest' },
  { label: 'Abs', value: 'abdominals' },
  { label: 'Legs', value: 'calves' },
  { label: 'Back', value: 'lats' },
  { label: 'Triceps', value: 'triceps' },
];

const Challenge = () => {
  const { isDarkMode } = useTheme();
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [timer, setTimer] = useState(null);

  const timerRef = useRef(null);

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardColor = isDarkMode ? '#1e1e1e' : '#f2f2f2';
  const textColor = isDarkMode ? '#fff' : '#000';

  const fetchExercises = async (muscle) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?muscle=${muscle}`, {
        headers: { 'X-Api-Key': API_KEY },
      });
      const data = await res.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMuscle) {
      fetchExercises(selectedMuscle);
      resetState();
    }
  }, [selectedMuscle]);

  useEffect(() => {
    if (timer === 0 && activeChallengeIndex !== null) {
      setCompletedChallenges((prev) => ({ ...prev, [activeChallengeIndex]: true }));
      clearInterval(timerRef.current);
      setActiveChallengeIndex(null);
      setTimer(null);
    }
  }, [timer]);

  const resetState = () => {
    setExpanded({});
    setActiveChallengeIndex(null);
    setCompletedChallenges({});
    setTimer(null);
    clearInterval(timerRef.current);
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleChallengeToggle = (index) => {
    if (completedChallenges[index]) return;

    if (activeChallengeIndex === null) {
      setActiveChallengeIndex(index);
      setTimer(TIMER_DURATION);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (activeChallengeIndex === index) {
      // Mark it manually as done before timer ends
      setCompletedChallenges((prev) => ({ ...prev, [index]: true }));
      clearInterval(timerRef.current);
      setActiveChallengeIndex(null);
      setTimer(null);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderItem = ({ item, index }) => {
    const isActive = activeChallengeIndex === index;
    const isDone = completedChallenges[index];

    return (
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.exerciseTitle, { color: textColor }]}>
            {item.name} {isDone && <Ionicons name="checkmark-circle" size={20} color="green" />}
          </Text>
          <TouchableOpacity onPress={() => toggleExpand(index)}>
            <Ionicons name={expanded[index] ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.exerciseDetail, { color: textColor }]}>Type: {item.type}</Text>
        <Text style={[styles.exerciseDetail, { color: textColor }]}>Equipment: {item.equipment}</Text>
        <Text style={[styles.exerciseDetail, { color: textColor }]}>Difficulty: {item.difficulty}</Text>

        {expanded[index] && (
          <Text style={[styles.instructions, { color: textColor }]}>Instructions: {item.instructions}</Text>
        )}

        {isActive && (
          <Text style={[styles.timerText, { color: 'orange', marginTop: 6 }]}>
            ⏱ {formatTime(timer)}
          </Text>
        )}

        <TouchableOpacity
          disabled={isDone || (activeChallengeIndex !== null && activeChallengeIndex !== index)}
          onPress={() => handleChallengeToggle(index)}
          style={[
            styles.actionButton,
            {
              backgroundColor: isDone
                ? 'gray'
                : isActive
                ? 'green'
                : activeChallengeIndex !== null
                ? '#999'
                : '#007bff',
              opacity: isDone ? 0.6 : 1,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {isDone ? 'Completed' : isActive ? 'Done' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Select a Muscle Group</Text>

      <RNPickerSelect
        placeholder={{ label: 'Choose muscle group...', value: null }}
        onValueChange={(value) => setSelectedMuscle(value)}
        items={muscleOptions}
        style={{
          inputIOS: [styles.dropdown, { color: textColor }],
          inputAndroid: [styles.dropdown, { color: textColor }],
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color={textColor} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <BottomTabBar />
    </View>
  );
};

export default Challenge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 24,
    paddingBottom: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dropdown: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  exerciseDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 6,
  },
  actionButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
