/**
 * TrainerListScreen.jsx
 * This screen displays a scrollable list of available fitness trainers.
 * Users can click on any trainer to view detailed information in a modal.
 * Each trainer includes:
 * - Name
 * - Specialty
 * - Years of Experience
 * - Skills
 * - Certifications
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

/**
 * Array of trainer objects used to render the trainer list.
 * Each object contains:
 * - name: Trainer's full name
 * - specialty: Area of focus
 * - experience: Years of experience
 * - skills: List of core skills
 * - certifications: List of certifications
 */
const TRAINERS = [
  {
    name: 'Adarsh Sapkota',
    specialty: 'Strength & Conditioning',
    experience: 10,
    skills: ['Strength Training', 'Progressive Overload', 'Form Coaching'],
    certifications: ['NSCA-CSCS', 'ACE CPT'],
  },
  {
    name: 'Suvam Parajuli',
    specialty: 'Cardio & Endurance',
    experience: 7,
    skills: ['HIIT', 'Marathon Prep', 'Heart Rate Monitoring'],
    certifications: ['ISSA Fitness Trainer'],
  },
  {
    name: 'Shrabhya Paudel',
    specialty: 'Functional Fitness',
    experience: 5,
    skills: ['Mobility Drills', 'Balance Training', 'Corrective Exercise'],
    certifications: ['NASM CES'],
  },
  {
    name: 'Sohan Koirala',
    specialty: 'Bodybuilding & Hypertrophy',
    experience: 8,
    skills: ['Muscle Isolation', 'Hypertrophy Techniques', 'Diet Coaching'],
    certifications: ['IFBB Certified', 'CPT Level II'],
  },
  {
    name: 'Samrat Bam',
    specialty: 'CrossFit & Agility',
    experience: 6,
    skills: ['Agility Drills', 'WOD Planning', 'Kettlebell Mastery'],
    certifications: ['CrossFit L1 Trainer', 'NASM PES'],
  },
  {
    name: 'Satya Shrestha',
    specialty: 'Rehab & Posture Therapy',
    experience: 9,
    skills: ['Postural Correction', 'Recovery Planning', 'Low Impact Training'],
    certifications: ['Physiotherapy BPT', 'Rehab Specialist'],
  },
  {
    name: 'Anjali Thapa',
    specialty: 'Prenatal & Postnatal Fitness',
    experience: 4,
    skills: ['Safe Pregnancy Workouts', 'Postnatal Core Rehab'],
    certifications: ['AFPA Prenatal Certified'],
  },
  {
    name: 'Meera Karki',
    specialty: 'Yoga & Mindfulness',
    experience: 12,
    skills: ['Hatha Yoga', 'Breathwork', 'Meditation Coaching'],
    certifications: ['RYT-500 Certified Yoga Trainer'],
  },
  {
    name: 'Binod Bhattarai',
    specialty: 'Core Strength',
    experience: 7,
    skills: ['Calisthenics', 'Energy Systems', 'Form Correction'],
    certifications: ['ACE CPT', 'RYT-200'],
  },
  {
    name: 'Asmita Neupane',
    specialty: 'Strength Yoga',
    experience: 6,
    skills: ['Breathwork', 'Hatha Yoga', 'Strength Flow'],
    certifications: ['RYT-200', 'RYT-500 Certified Yoga Trainer'],
  },
];

const TrainerListScreen = () => {
  const { isDarkMode } = useTheme();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Trigger modal display with trainer's detailed info.
   * @param {object} trainer Trainer object
   */
  const openTrainerModal = (trainer) => {
    setSelectedTrainer(trainer);
    setModalVisible(true);
  };

  /**
   * Close the trainer modal.
   */
  const closeTrainerModal = () => {
    setModalVisible(false);
    setSelectedTrainer(null);
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Meet Our Trainers</Text>

          {TRAINERS.map((trainer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trainerCard}
              onPress={() => openTrainerModal(trainer)}
            >
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modal Display */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeTrainerModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {selectedTrainer && (
                <>
                  <Text style={styles.modalTitle}>{selectedTrainer.name}</Text>
                  <Text style={styles.modalSubtitle}>{selectedTrainer.specialty}</Text>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Experience</Text>
                    <Text style={styles.sectionText}>
                      {selectedTrainer.experience} years of experience
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                    {selectedTrainer.skills.map((skill, i) => (
                      <Text key={i} style={styles.sectionText}>
                        • {skill}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Certifications</Text>
                    {selectedTrainer.certifications.map((cert, i) => (
                      <Text key={i} style={styles.sectionText}>
                        • {cert}
                      </Text>
                    ))}
                  </View>

                  <Pressable style={styles.okButton} onPress={closeTrainerModal}>
                    <Text style={styles.okButtonText}>Close</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
};

/**
 * Returns dynamic style sheet based on dark mode flag.
 * @param {boolean} isDarkMode 
 * @returns {StyleSheet}
 */
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#000',
    },
    trainerCard: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      marginBottom: 15,
    },
    trainerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    trainerSpecialty: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginTop: 5,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderRadius: 16,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 5,
    },
    modalSubtitle: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 15,
    },
    section: {
      marginBottom: 12,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 5,
    },
    sectionText: {
      fontSize: 13,
      color: isDarkMode ? '#ddd' : '#333',
      marginLeft: 5,
    },
    okButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 12,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    okButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

export default TrainerListScreen;
