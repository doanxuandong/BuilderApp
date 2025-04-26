import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatHeader from './Components/ChatHeader';
import MessageList from './Components/MessageList';
import MessageInput from './Components/MessageInput';

const BoxChat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const { userId } = route.params;
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        getCurrentUserId();
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    useEffect(() => {
        if (currentUserId && userId) {
            fetchMessages();
        }
    }, [currentUserId, userId]);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    }

    const fetchMessages = async () => {
        if (!currentUserId || !userId) return;

        const chatId = [currentUserId, userId].sort().join('_');

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        const unsubscribe = firestore()
            .collection('Chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(messages);
            }, error => {
                console.error('Error fetching messages:', error);
            });

        unsubscribeRef.current = unsubscribe;
    };

    const sendMessage = async () => {
        if (!text.trim() || !currentUserId || !userId) return;

        const chatId = [currentUserId, userId].sort().join('_');
        const message = {
            text: text.trim(),
            userId: currentUserId,
            createdAt: new Date(),
        };

        try {
            const chatDoc = await firestore()
                .collection('Chats')
                .doc(chatId)
                .get();

            if (!chatDoc.exists) {
                await firestore()
                    .collection('Chats')
                    .doc(chatId)
                    .set({
                        participants: [currentUserId, userId],
                        createdAt: new Date(),
                        lastMessage: message.text,
                    });
            }

            await firestore()
                .collection('Chats')
                .doc(chatId)
                .collection('messages')
                .add(message);

            await firestore()
                .collection('Chats')
                .doc(chatId)
                .update({
                    lastMessage: message.text,
                });

            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ChatHeader userId={userId} navigation={navigation} />
            <MessageList
                messages={messages}
                currentUserId={currentUserId}
                navigation={navigation}
            />
            <MessageInput
                text={text}
                setText={setText}
                onSend={sendMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default BoxChat;