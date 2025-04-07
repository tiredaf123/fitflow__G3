import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native'; // <-- drawer navigation hook

const DashboardScreen = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation(); // <-- drawer navigation control

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0',
        },
        navbar: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
            borderColor: isDarkMode ? '#444' : '#DDD',
        },
        section: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
            borderColor: isDarkMode ? '#444' : '#DDD',
        },
        text: {
            color: isDarkMode ? '#FFF' : '#000',
        },
        iconColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        cardBackground: isDarkMode ? '#333' : '#E0E0E0'
    };

    return (
        <View style={themeStyles.container}>
            <ScrollView style={{ padding: 20 }}>

                {/* Top Navigation Bar */}
                <View style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    marginBottom: 20
                }, themeStyles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <MaterialIcon name="menu" size={28} color={themeStyles.text.color} />
                    </TouchableOpacity>
                    <Text style={[{ fontSize: 20 }, themeStyles.text]}>Dashboard</Text>
                    <MaterialIcon name="calendar-today" size={24} color={themeStyles.text.color} />
                </View>

                {/* Calorie Budget Section */}
                <View style={[{ padding: 20, borderRadius: 16, marginBottom: 20 }, themeStyles.section]}>
                    <Text style={[{ textAlign: 'center', marginBottom: 10 }, themeStyles.text]}>Calorie Budget</Text>
                    <Text style={{ color: themeStyles.iconColor, fontSize: 28, textAlign: 'center', marginBottom: 20 }}>0</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="heartbeat" size={24} color={themeStyles.iconColor} />
                            <Text style={[{ marginTop: 5 }, themeStyles.text]}>Exercise</Text>
                            <Text style={themeStyles.text}>0</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="tint" size={24} color={themeStyles.iconColor} />
                            <Text style={[{ marginTop: 5 }, themeStyles.text]}>Water</Text>
                            <Text style={themeStyles.text}>0</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="male" size={24} color={themeStyles.iconColor} />
                            <Text style={[{ marginTop: 5 }, themeStyles.text]}>Steps</Text>
                            <Text style={themeStyles.text}>0</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Icon name="pencil" size={24} color={themeStyles.iconColor} />
                        <Icon name="cutlery" size={24} color={themeStyles.iconColor} />
                        <Icon name="pizza-slice" size={24} color={themeStyles.iconColor} />
                    </View>
                </View>

                {/* Weight In, Goals, and Food Management Section */}
                <View>
                    <TouchableOpacity style={[{
                        padding: 15,
                        borderRadius: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }, { backgroundColor: themeStyles.cardBackground }]}>
                        <Icon name="balance-scale" size={20} color={themeStyles.text.color} />
                        <Text style={[{ fontSize: 16 }, themeStyles.text]}>Weight In</Text>
                        <Text style={{ color: themeStyles.iconColor, fontSize: 16 }}>65</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[{
                        padding: 15,
                        borderRadius: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }, { backgroundColor: themeStyles.cardBackground }]}>
                        <Icon name="bullseye" size={20} color={themeStyles.text.color} />
                        <Text style={[{ fontSize: 16, marginLeft: 10 }, themeStyles.text]}>My Weight Goal & Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[{
                        padding: 15,
                        borderRadius: 12,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }, { backgroundColor: themeStyles.cardBackground }]}>
                        <Icon name="cutlery" size={20} color={themeStyles.text.color} />
                        <Text style={[{ fontSize: 16, marginLeft: 10 }, themeStyles.text]}>Manage my Foods</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <BottomTabBar />
        </View>
    );
};

export default DashboardScreen;
