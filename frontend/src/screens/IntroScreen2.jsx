import React, { useRef } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
//Adharsh sapkota
const { width } = Dimensions.get('window');

const IntroScreen2 = ({ backgroundImage, title, description, buttonText, nextScreen }) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;

    const handleGesture = Animated.event([
        { nativeEvent: { translationX: translateX } }
    ], { useNativeDriver: true });

    const handleGestureEnd = ({ nativeEvent }) => {
        if (nativeEvent.translationX < -100) {
            navigation.navigate(nextScreen);
        } else {
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGestureEnd}>
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate(nextScreen)}
                            >
                                <Text style={styles.buttonText}>{buttonText}</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});

export const IntroPage4 = () => (
    <IntroScreen2
        backgroundImage={require('../assets/ExerciseImages/11.png')}
        title="WELCOME ONBOARD!"
        description="Every journey begins with a single step. Stay consistent, stay strong, and let’s crush your fitness goals together!"
        buttonText="Let’s Go ➔"
        nextScreen="IntroPage5"
    />
);

export const IntroPage5 = () => (
    <IntroScreen2
        backgroundImage={require('../assets/ExerciseImages/10.png')}
        title="Fitness App"
        description="Build your dream Physique"
        buttonText="Next"
        nextScreen="IntroPage6"
    />
);

export const IntroPage6 = () => (
    <IntroScreen2
        backgroundImage={require('../assets/ExerciseImages/8.png')}
        title="Fitness App"
        description="Best Workout and Diet Plan"
        buttonText="Start Now ➔"
        nextScreen="HomeScreen"
    />
);

export default IntroScreen2;