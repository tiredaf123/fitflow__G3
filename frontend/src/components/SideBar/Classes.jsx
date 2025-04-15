import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../BottomTabBar'; // ✅ Confirm this path is correct

const classData = [
  { id: '1', name: 'Yoga Flow', time: '08:00 AM', instructor: 'Alice' },
  { id: '2', name: 'HIIT Burn', time: '10:00 AM', instructor: 'James' },
  { id: '3', name: 'Zumba Energy', time: '12:00 PM', instructor: 'Maria' },
  { id: '4', name: 'Pilates Core', time: '03:00 PM', instructor: 'Sophie' },
];

const Classes = () => {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardColor = isDarkMode ? '#1e1e1e' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#000';

  const renderClassItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]}>
      <Text style={[styles.className, { color: textColor }]}>{item.name}</Text>
      <Text style={[styles.classInfo, { color: textColor }]}>Time: {item.time}</Text>
      <Text style={[styles.classInfo, { color: textColor }]}>Instructor: {item.instructor}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Group Classes</Text>
      <FlatList
        data={classData}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <BottomTabBar />
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5.5,
    paddingTop: 24,
    paddingBottom: 70, // space for bottom bar
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 15,
  },
  card: {
    padding: 13,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
  },
  classInfo: {
    fontSize: 14,
    marginTop: 4,
  },
});
