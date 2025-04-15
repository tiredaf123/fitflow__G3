import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomTabBar from '../BottomTabBar';

const Progress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Page</Text>
      <Text>Track your workout and fitness progress here.</Text>
      <BottomTabBar/>
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
