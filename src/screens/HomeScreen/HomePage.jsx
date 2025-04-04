import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Animated,
    Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';

const { width } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const { selectedGoal } = route.params || {};

    const [flippedCardId, setFlippedCardId] = useState(null);
    const flipAnimations = useRef({}).current;

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
        },
        greetingText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDarkMode ? '#FFF' : '#000',
        },
        subText: {
            fontSize: 14,
            color: isDarkMode ? '#AAA' : '#666',
        },
    };

    const workoutLibrary = [
        { id: 'workout-1', name: 'Morning Yoga', goal: 'Improve Flexibility', image: require('../../assets/Images/yoga.png'), caloriesBurned: '100-150 kcal for 20-30 min' },
        { id: 'workout-2', name: 'HIIT Training', goal: 'Lose Weight', image: require('../../assets/Images/hiit.png') },
        { id: 'workout-3', name: 'Strength Training', goal: 'Build Muscles', image: require('../../assets/Images/strength.png') },
        { id: 'workout-4', name: 'Cardio Blast', goal: 'Lose Weight', image: require('../../assets/Images/cardio.png') },
        { id: 'workout-5', name: 'Pilates', goal: 'Tone & Define', image: require('../../assets/Images/pilates.png') },
        { id: 'workout-6', name: 'Stretching', goal: 'Improve Flexibility', image: require('../../assets/Images/stretching.png') },
    ];

    const dietFoods = [
        { id: 'diet-1', name: 'Salad Bowl', image: require('../../assets/Images/salad.png'), calories: 150, protein: '3g' },
        { id: 'diet-2', name: 'Grilled Chicken', image: require('../../assets/Images/chicken.png'), calories: 220, protein: '30g' },
        { id: 'diet-3', name: 'Fruit Mix', image: require('../../assets/Images/fruits.png'), calories: 120, protein: '2g' },
        { id: 'diet-4', name: 'Oatmeal', image: require('../../assets/Images/oatmeal.png'), calories: 180, protein: '5g' },
        { id: 'diet-5', name: 'Smoothie', image: require('../../assets/Images/smoothie.png'), calories: 200, protein: '8g' },
    ];

    const getFlipAnimation = (id) => {
        if (!flipAnimations[id]) {
            flipAnimations[id] = new Animated.Value(0);
        }
        return flipAnimations[id];
    };

    const handleFlip = (id) => {
        if (flippedCardId && flippedCardId !== id) {
            Animated.timing(getFlipAnimation(flippedCardId), {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(() => {
                setFlippedCardId(id);
                Animated.timing(getFlipAnimation(id), {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }).start();
            });
        } else if (flippedCardId === id) {
            Animated.timing(getFlipAnimation(id), {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(() => setFlippedCardId(null));
        } else {
            setFlippedCardId(id);
            Animated.timing(getFlipAnimation(id), {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start();
        }
    };

    const filteredWorkouts = selectedGoal
        ? workoutLibrary.filter((item) => item.goal === selectedGoal)
        : workoutLibrary;

    return (
        <View style={themeStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View style={styles.navbar}>
                    <Text style={styles.title}>FitnessApp</Text>
                    <TouchableOpacity>
                        <Icon name="notifications" size={28} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileWrapper}>
                    <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
                    <View>
                        <Text style={themeStyles.greetingText}>Hello, Legend!</Text>
                        {selectedGoal && <Text style={themeStyles.subText}>Your goal: {selectedGoal}</Text>}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Recommended Diet Plans 🍏</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {dietFoods.map((item) => {
                        const anim = getFlipAnimation(item.id);
                        const frontInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                        });
                        const backInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['180deg', '360deg'],
                        });

                        return (
                            <TouchableOpacity key={item.id} onPress={() => handleFlip(item.id)}>
                                <View style={styles.cardContainer}>
                                    <Animated.View
                                        style={[styles.card, {
                                            transform: [{ rotateY: frontInterpolate }],
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                        }]}
                                    >
                                        <Image source={item.image} style={styles.cardImage} />
                                        <Text style={styles.cardText}>{item.name}</Text>
                                    </Animated.View>

                                    <Animated.View
                                        style={[styles.card, styles.cardBack, {
                                            transform: [{ rotateY: backInterpolate }],
                                            backfaceVisibility: 'hidden',
                                        }]}
                                    >
                                        <Text style={styles.cardText}>{item.name}</Text>
                                        <Text style={styles.cardText}>Calories: {item.calories}</Text>
                                        <Text style={styles.cardText}>Protein: {item.protein}</Text>
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <Text style={styles.sectionTitle}>Workout Recommendations 🏋️</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {filteredWorkouts.map((item) => {
                        const anim = getFlipAnimation(item.id);
                        const frontInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                        });
                        const backInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['180deg', '360deg'],
                        });

                        return (
                            <TouchableOpacity key={item.id} onPress={() => handleFlip(item.id)}>
                                <View style={styles.cardContainer}>
                                    <Animated.View
                                        style={[styles.card, {
                                            transform: [{ rotateY: frontInterpolate }],
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                        }]}
                                    >
                                        <Image source={item.image} style={styles.cardImage} />
                                        <Text style={styles.cardText}>{item.name}</Text>
                                    </Animated.View>

                                    <Animated.View
                                        style={[styles.card, styles.cardBack, {
                                            transform: [{ rotateY: backInterpolate }],
                                            backfaceVisibility: 'hidden',
                                        }]}
                                    >
                                        <Text style={styles.cardText}>{item.name}</Text>
                                        {item.caloriesBurned && (
                                            <Text style={styles.cardText}>Burns: {item.caloriesBurned}</Text>
                                        )}
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ✅ Clean "Change Goal" Button */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('GoalSelection')}
                    >
                        <Icon name="track-changes" size={22} color="#FEC400" />
                        <Text style={styles.actionButtonText}>Change Fitness Goal</Text>
                    </TouchableOpacity>
                </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FEC400',
    },
    profileWrapper: {
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 30,
        color: '#FEC400',
    },
    scrollRow: {
        paddingVertical: 20,
        paddingLeft: 20,
    },
    cardContainer: {
        width: 130,
        height: 160,
        marginRight: 15,
        perspective: 1000,
    },
    card: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBack: {
        backgroundColor: '#FFEDD5',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    cardText: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#444',
        textAlign: 'center',
    },
    buttonGroup: {
        marginTop: 30,
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FEC400',
    },
    actionButtonText: {
        color: '#FEC400',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default HomeScreen;
