import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const CalendarScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState({});
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [membershipDeadline, setMembershipDeadline] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    checkToken();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserId(data._id);
      } catch (err) {
        console.log('Error fetching userId:', err);
      }
    };
    fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId || !token) return;
      try {
        const res = await fetch(`http://10.0.2.2:5000/api/calendar/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (Array.isArray(result)) {
          const notesObject = result.reduce((acc, note) => {
            acc[note.date] = note.note;
            return acc;
          }, {});
          setAllNotes(notesObject);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    fetchNotes();
  }, [userId, token]);

  useEffect(() => {
    const fetchMembershipDeadline = async () => {
      if (!userId || !token) return;
      try {
        const res = await fetch(`http://10.0.2.2:5000/api/profile/membership`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMembershipDeadline(data.membershipDeadline);
      } catch (err) {
        console.error('Error fetching membership deadline:', err);
      }
    };
    fetchMembershipDeadline();
  }, [userId, token]);

  useEffect(() => {
    const updateCountdown = () => {
      if (membershipDeadline) {
        const now = moment();
        const deadline = moment(membershipDeadline);
        const diffInSeconds = deadline.diff(now, 'seconds');

        if (diffInSeconds <= 0) {
          setCountdown('EXPIRED');
        } else {
          const hours = Math.floor(diffInSeconds / 3600);
          const minutes = Math.floor((diffInSeconds % 3600) / 60);
          const seconds = diffInSeconds % 60;

          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [membershipDeadline]);

  const handleSaveNotes = async () => {
    if (!selected || !notes.trim() || !token) return;
    const noteData = { date: selected, note: notes };
    try {
      const res = await fetch('http://10.0.2.2:5000/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });
      const result = await res.json();
      if (res.ok) {
        const updatedNotes = { ...allNotes, [selected]: notes };
        setAllNotes(updatedNotes);
        setNotes('');
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        console.error('Backend error:', result);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const handleDeleteNote = async () => {
    if (!selected || !token) return;
    try {
      const res = await fetch(`http://10.0.2.2:5000/api/calendar/${userId}/${selected}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedNotes = { ...allNotes };
        delete updatedNotes[selected];
        setAllNotes(updatedNotes);
        setNotes('');
        setSelected('');
        Alert.alert('Success', 'Note deleted successfully!');
      } else {
        Alert.alert('Error', 'Failed to delete the note.');
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const getMarkedDates = () => {
    const marked = {};
    Object.keys(allNotes).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
      };
    });
    if (membershipDeadline) {
      const deadline = moment(membershipDeadline).format('YYYY-MM-DD');
      marked[deadline] = {
        ...marked[deadline],
        customStyles: {
          container: { backgroundColor: '#cc0000', borderRadius: 50 },
          text: { color: 'white', fontWeight: 'bold' },
        },
      };
    }
    if (selected) {
      marked[selected] = {
        ...marked[selected],
        customStyles: {
          container: { backgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00', borderRadius: 50 },
          text: { color: 'white', fontWeight: '600' },
        },
      };
    }
    return marked;
  };

  const theme = {
    calendarBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
    dayTextColor: isDarkMode ? '#fff' : '#000',
    selectedDayBackgroundColor: '#4444ff',
    todayTextColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    arrowColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    textSectionTitleColor: isDarkMode ? '#ccc' : '#000',
    dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Fitness Calendar</Text>
        <View style={{ width: 28 }} />
      </View>

      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
          setNotes(allNotes[day.dateString] || '');
        }}
        markedDates={getMarkedDates()}
        markingType="custom"
        theme={theme}
      />

      {selected && (
        <View style={styles.notesSection}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 16, fontWeight: '600' }}>Notes for {selected}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#f1f1f1', color: isDarkMode ? '#fff' : '#000' }]}
            placeholder="e.g., Upper body workout and cardio"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <TouchableOpacity
            onPress={handleSaveNotes}
            style={[styles.button, { backgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00' }]}
          >
            <Text style={styles.buttonText}>Save Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteNote}
            style={[styles.button, { backgroundColor: 'red', marginTop: 10 }]}
          >
            <Text style={styles.buttonText}>Delete Note</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.membershipText, { color: isDarkMode ? '#ff6b6b' : '#cc0000' }]}> 
        {countdown === 'EXPIRED' ? 'Membership has expired' : `Membership expires in: ${countdown}`}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 20,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    minHeight: 100,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  membershipText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CalendarScreen;