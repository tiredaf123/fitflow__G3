import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const AdminPanel = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <View style={styles.row}>
        <View style={styles.circleCard}>
          <Text style={styles.circleText}>+23%</Text>
          <Text style={styles.circleSubtext}>Total Progress</Text>
        </View>
        <View style={styles.squareCard}>
          <Text style={styles.cardTitle}>Today's Activity</Text>
          <Text style={styles.cardItem}>🟡 Squats - 10 sets</Text>
          <Text style={styles.cardItem}>🟢 Lunges - 15 sets</Text>
          <Text style={styles.cardItem}>🔵 Battling rope - 20 mins</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.cardTitle}>📈 Monthly Activity</Text>
        <LineChart
          data={{
            labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{
              data: [20, 45, 28, 80, 99, 43],
              strokeWidth: 2
            }]
          }}
          width={width * 0.9}
          height={220}
          chartConfig={{
            backgroundColor: '#1c1c1e',
            backgroundGradientFrom: '#1c1c1e',
            backgroundGradientTo: '#1c1c1e',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
            labelColor: () => '#fff',
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#FFD700'
            }
          }}
          bezier
        />
      </View>

      <View style={styles.cardList}>
        <Text style={styles.cardTitle}>💪 Trainers</Text>
        {['Jehad Arnold', 'Hohan Arnold', 'Sogon Arnold'].map((name, i) => (
          <TouchableOpacity key={i} style={styles.listItem}>
            <Text style={styles.listText}>{name}</Text>
            <Text style={styles.listSubText}>🏋️ Expert Trainer</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cardList}>
        <Text style={styles.cardTitle}>🥗 Diet Plans</Text>
        {['Keto Plan', 'Vegan Protein Boost', 'High Carb Routine'].map((plan, i) => (
          <TouchableOpacity key={i} style={styles.listItem}>
            <Text style={styles.listText}>{plan}</Text>
            <Text style={styles.listSubText}>📋 Custom meal guide</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  circleCard: {
    backgroundColor: '#1c1c1e',
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  circleText: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
  },
  circleSubtext: {
    color: '#fff',
    fontSize: 13,
    marginTop: 5,
  },
  squareCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 15,
    width: width * 0.5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardItem: {
    fontSize: 15,
    color: '#ccc',
    paddingVertical: 2,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardList: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    marginHorizontal: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 5,
    marginTop: 20,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  listText: {
    fontSize: 17,
    color: '#FFD700',
    fontWeight: '600',
  },
  listSubText: {
    fontSize: 13,
    color: '#999',
  },
});

export default AdminPanel;
