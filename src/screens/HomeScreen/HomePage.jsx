import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
        },
        logo: {
            fontSize: 28,
            color: isDarkMode ? '#FEC400' : '#FF6B00',
            fontWeight: 'bold',
        },
        greeting: {
            fontSize: 24,
            color: isDarkMode ? '#FFF' : '#000',
            fontWeight: 'bold',
        },
        subtext: {
            color: isDarkMode ? '#AAA' : '#666',
            fontSize: 14,
        },
        summaryBox: {
            backgroundColor: isDarkMode ? '#0D0D0D' : '#E0E0E0',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center',
            width: '30%',
        },
        summaryText: {
            color: isDarkMode ? '#FEC400' : '#FF6B00',
            fontSize: 20,
            fontWeight: 'bold',
        }
    };

    return (
        <View style={themeStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Top Navbar */}
                <View style={styles.navbar}>
                    <Text style={themeStyles.logo}>FitnessApp</Text>
                    <TouchableOpacity>
                        <Icon name="notifications" size={28} color={isDarkMode ? "#FFF" : "#000"} />
                    </TouchableOpacity>
                </View>

                {/* Greeting & Daily Summary */}
                <View style={styles.greetingContainer}>
                    <View style={styles.profileContainer}>
                        <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
                        <View>
                            <Text style={themeStyles.greeting}>Good Morning, User!</Text>
                            <Text style={themeStyles.subtext}>Stay consistent and reach your goals!</Text>
                        </View>
                    </View>

                    <View style={styles.summaryContainer}>
                        <View style={themeStyles.summaryBox}>
                            <Text style={themeStyles.summaryText}>1200</Text>
                            <Text style={themeStyles.subtext}>Calories Burned</Text>
                        </View>
                        <View style={themeStyles.summaryBox}>
                            <Text style={themeStyles.summaryText}>8500</Text>
                            <Text style={themeStyles.subtext}>Steps</Text>
                        </View>
                        <View style={themeStyles.summaryBox}>
                            <Text style={themeStyles.summaryText}>45m</Text>
                            <Text style={themeStyles.subtext}>Workout</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* BottomTabBar */}
            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    }
});

export default HomeScreen;
