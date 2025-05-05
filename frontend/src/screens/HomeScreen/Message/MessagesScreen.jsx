import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '../../../config/config';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io(BASE_URL);

const MessagesScreen = ({ navigation, route }) => {
  const { trainer, bookingDate } = route.params || {};
  const trainerAvatar = trainer?.imageUrl?.startsWith('http')
    ? trainer.imageUrl
    : `${BASE_URL}/${trainer?.imageUrl || ''}`;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [canMessage, setCanMessage] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    const now = new Date();
    const booked = new Date(bookingDate);
    const diffInDays = (now - booked) / (1000 * 60 * 60 * 24);
    setCanMessage(diffInDays <= 2);
  }, [bookingDate]);

  const deduplicateMessages = (msgs) => {
    const seen = new Set();
    return msgs.filter((msg) => {
      const id = msg._id || msg.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      socket.emit('join', { trainerId: trainer._id, token });

      socket.on('receiveMessage', (msg) => {
        if (!isMounted) return;
        setMessages((prev) => deduplicateMessages([...prev, msg]));
      });

      socket.io.on('reconnect', async () => {
        try {
          const res = await fetch(`${BASE_URL}/messages/${trainer._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (isMounted) setMessages((prev) => deduplicateMessages([...prev, ...data]));
        } catch (err) {
          console.log('Reconnect fetch error:', err);
        }
      });

      try {
        const res = await fetch(`${BASE_URL}/messages/${trainer._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (isMounted) setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Initial message fetch error:', err);
      }
    };

    init();
    return () => {
      isMounted = false;
      socket.off('receiveMessage');
      socket.io.off('reconnect');
      socket.disconnect();
    };
  }, [trainer]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = await AsyncStorage.getItem('token');
    const message = {
      text: input.trim(),
      trainerId: trainer._id,
    };

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        socket.emit('sendMessage', data);
      } else {
        console.warn('Send message failed:', data.error);
      }
    } catch (err) {
      console.error('Message send error:', err);
    }

    setInput('');
  };

  const sendImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.didCancel || !result.assets?.length) return;

    const image = result.assets[0];
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    });
    formData.append('trainerId', trainer._id);

    try {
      const res = await fetch(`${BASE_URL}/messages/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        socket.emit('sendMessage', data);
      } else {
        console.warn('Image send failed:', data.error);
      }
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    const messageStyle = isUser ? styles.userMessage : styles.trainerMessage;
    const textStyle = isUser ? styles.userText : styles.trainerText;

    const imageUri = item.image?.startsWith('http') ? item.image : `${BASE_URL}/${item.image}`;

    return (
      <TouchableOpacity
        onLongPress={() =>
          setMessages((prev) =>
            prev.filter((msg) => (msg._id || msg.id) !== (item._id || item.id))
          )
        }
        style={[styles.messageContainer, messageStyle]}
      >
        {item.type === 'image' && item.image ? (
          <Image source={{ uri: imageUri }} style={styles.imageMessage} />
        ) : (
          <>
            <Text style={[styles.messageText, textStyle]}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </>
        )}
        {item.pending && <Text style={styles.pendingText}>Sending...</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: trainerAvatar }} style={styles.trainerImage} />
        <Text style={styles.header}>Chat with {trainer.username}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {canMessage ? (
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={sendImage} style={styles.imageIcon}>
            <Ionicons name="image-outline" size={24} color="#00BFFF" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.inputRow, { justifyContent: 'center' }]}>
          <Text style={{ color: 'gray', fontStyle: 'italic' }}>
            Free chat period has ended. Messaging disabled.
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  backButton: { marginRight: 10 },
  trainerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  header: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatContainer: { padding: 10 },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  trainerMessage: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
  messageText: { fontSize: 16 },
  userText: { color: '#000' },
  trainerText: { color: '#000' },
  timestamp: { fontSize: 10, color: '#555', marginTop: 4, alignSelf: 'flex-end' },
  pendingText: { fontSize: 10, color: 'orange', marginTop: 2, alignSelf: 'flex-end' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  imageIcon: { padding: 6 },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  imageMessage: { width: 200, height: 200, borderRadius: 10 },
});

export default MessagesScreen;
