import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const [hydrationCount, setHydrationCount] = useState(0);

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
        },
        sectionTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginLeft: 20,
            marginTop: 30,
            color: isDarkMode ? '#FFF' : '#333',
        },
    };

    const dietFoods = [
        { id: 1, name: "Salad Bowl", image: require('../../assets/Images/salad.png') },
        { id: 2, name: "Grilled Chicken", image: require('../../assets/Images/chicken.png') },
        { id: 3, name: "Fruit Mix", image: require('../../assets/Images/fruits.png') },
        { id: 4, name: "Oatmeal", image: require('../../assets/Images/oatmeal.png') },
        { id: 5, name: "Smoothie", image: require('../../assets/Images/smoothie.png') },
    ];

    const workoutRecommendations = [
        { id: 1, name: "Morning Yoga", image: require('../../assets/Images/yoga.png') },
        { id: 2, name: "HIIT Training", image: require('../../assets/Images/hiit.png') },
        { id: 3, name: "Strength Training", image: require('../../assets/Images/strength.png') },
        { id: 4, name: "Cardio Blast", image: require('../../assets/Images/cardio.png') },
    ];

    return (
        <View style={themeStyles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
            >                
                <View style={styles.navbar}>
                    <Text style={themeStyles.logo}>FitnessApp</Text>
                    <TouchableOpacity>
                        <Icon name="notifications" size={28} color={isDarkMode ? "#FFF" : "#000"} />
                    </TouchableOpacity>
                </View>

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

                <Text style={themeStyles.sectionTitle}>Hydration Tracker 💧</Text>
                <View style={styles.hydrationTracker}>
                    <TouchableOpacity onPress={() => setHydrationCount(hydrationCount + 1)}>
                        <Image source={require('../../assets/Images/water-glass.png')} style={styles.hydrationIcon} />
                    </TouchableOpacity>
                    <Text style={styles.hydrationText}>{hydrationCount} Glasses</Text>
                    <TouchableOpacity onPress={() => setHydrationCount(Math.max(hydrationCount - 1, 0))}>
                        <Icon name="remove-circle-outline" size={30} color="#0277BD" />
                    </TouchableOpacity>
                </View>

                <Text style={themeStyles.sectionTitle}>Recommended Diet Plans 🍏</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.dietScroll}>
                    {dietFoods.map((food) => (
                        <View key={food.id} style={styles.foodCard}>
                            <Image source={food.image} style={styles.foodImage} />
                            <Text style={styles.foodText}>{food.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text style={themeStyles.sectionTitle}>Today's Workout Recommendations 🏋️</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.dietScroll}>
                    {workoutRecommendations.map((workout) => (
                        <View key={workout.id} style={styles.foodCard}>
                            <Image source={workout.image} style={styles.foodImage} />
                            <Text style={styles.foodText}>{workout.name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>

            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
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
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 20,
    },
    hydrationTracker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 12,
    },
    hydrationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0277BD',
    },
    hydrationIcon: {
        width: 30,
        height: 30,
    },
    dietScroll: {
        paddingVertical: 15,
        paddingLeft: 20,
    },
    foodCard: {
        width: 130,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginRight: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
        elevation: 4,
    },
    foodImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    foodText: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#444',
    },
});

export default HomeScreen;
