import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const themeStyles = {
    container: { flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' },
    navbar: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderColor: isDarkMode ? '#444' : '#DDD',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    section: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderColor: isDarkMode ? '#444' : '#DDD',
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
    },
    text: { color: isDarkMode ? '#FFF' : '#000' },
    iconColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    cardBackground: isDarkMode ? '#333' : '#E0E0E0',
    sectionItem: { alignItems: 'center', flex: 1 },
    sectionText: { marginTop: 5 },
  };

  return (
    <View style={themeStyles.container}>
      <ScrollView style={{ padding: 20 }}>

        {/* Top Navigation Bar with Drawer Toggle */}
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, themeStyles.navbar]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialIcon name="menu" size={28} color={themeStyles.text.color} />
          </TouchableOpacity>
          <Text style={[{ fontSize: 22, marginLeft: 15 }, themeStyles.text]}>Dashboard</Text>
        </View>

        {/* Calendar Navigation (Touchable) */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Calendar')}
          style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginBottom: 20
          }, themeStyles.navbar]}
        >
          <MaterialIcon name="chevron-left" size={28} color={themeStyles.text.color} />
          <Text style={[{ fontSize: 18 }, themeStyles.text]}>Today</Text>
          <MaterialIcon name="chevron-right" size={28} color={themeStyles.text.color} />
        </TouchableOpacity>

        {/* Calorie Budget Section */}
        <View style={themeStyles.section}>
          <Text style={[{ textAlign: 'center', marginBottom: 10 }, themeStyles.text]}>Calorie Budget</Text>
          <Text style={{ color: themeStyles.iconColor, fontSize: 28, textAlign: 'center', marginBottom: 20 }}>0</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            {[
              { name: 'heartbeat', label: 'Exercise' },
              { name: 'tint', label: 'Water' },
              { name: 'male', label: 'Steps' },
            ].map((item, index) => (
              <View key={index} style={themeStyles.sectionItem}>
                <Icon name={item.name} size={24} color={themeStyles.iconColor} />
                <Text style={[themeStyles.sectionText, themeStyles.text]}>{item.label}</Text>
                <Text style={themeStyles.text}>0</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            {[
              { name: 'pencil', label: 'Notes' },
              { name: 'cutlery', label: 'Food' },
              { name: 'question-circle', label: 'Questions' },
            ].map((item, index) => (
              <View key={index} style={themeStyles.sectionItem}>
                <Icon name={item.name} size={24} color={themeStyles.iconColor} />
                <Text style={[themeStyles.sectionText, themeStyles.text]}>{item.label}</Text>
                <Text style={themeStyles.text}>0</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weight, Goals, and Food Management */}
        {[
          { name: 'balance-scale', text: 'Weight In', value: '65', subtext: 'Last recorded on Apr 7', screen: 'WeightIn' },
          { name: 'bullseye', text: 'My Weight Goal & Plan', screen: 'WeightGoal' },
          { name: 'cutlery', text: 'Manage my Foods', screen: 'FoodManager' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            style={[{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              borderRadius: 12,
              marginBottom: 12
            }, { backgroundColor: themeStyles.cardBackground }]}
          >
            <Icon name={item.name} size={20} color={themeStyles.text.color} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[{ fontSize: 16 }, themeStyles.text]}>{item.text}</Text>
              {item.subtext && (
                <Text style={[{ fontSize: 12, marginTop: 2 }, themeStyles.text]}>
                  {item.subtext}
                </Text>
              )}
            </View>
            {item.value && <Text style={{ color: themeStyles.iconColor, fontSize: 16 }}>{item.value}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

export default DashboardScreen;
