import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../config/config';

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessagesScreen = ({ route }) => {
  const navigation = useNavigation();
  const { trainer } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        Alert.alert('Authentication Error', 'Please login again.');
        navigation.goBack();
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/messages/user/${trainer._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (isMounted) setMessages(Array.isArray(data) ? data : []);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (err) {
        Alert.alert('Error', 'Failed to load messages.');
      }
      setLoading(false);
    };

    fetchMessages();
    return () => {
      isMounted = false;
    };
  }, [trainer, navigation]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Authentication Error', 'Please login again.');
      setSending(false);
      navigation.goBack();
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/messages/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: trainer._id,
          text: input.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setInput('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } else {
        Alert.alert('Error', data.error || 'Failed to send message.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send message.');
    }
    setSending(false);
  };

  const renderItem = ({ item }) => {
    const isUser = item.senderRole?.toLowerCase() === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.rightRow : styles.leftRow]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.trainerBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.trainerText]}>
            {item.text}
          </Text>
          <Text style={styles.timeText}>{formatTime(item.timestamp || item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trainer.fullName || trainer.username || 'Trainer'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id ?? index.toString()}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
              </View>
            )
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!sending}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            disabled={sending}
          >
            <Icon name="send" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#333' },
  messageRow: { flexDirection: 'row', marginHorizontal: 15, marginVertical: 6 },
  leftRow: { justifyContent: 'flex-start' },
  rightRow: { justifyContent: 'flex-end' },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
  },
  trainerBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageText: { fontSize: 16 },
  trainerText: { color: '#000' },
  userText: { color: '#fff' },
  timeText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#7daaff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default MessagesScreen;
