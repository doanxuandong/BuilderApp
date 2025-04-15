import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpName from './Comment/UpName';
import UpAv from './Comment/UpAv';

const BoxChat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const { userId } = route.params;

    useEffect(() => {
        getCurrentUserId();
        fetchMessages();
    }, []);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    }

    const fetchMessages = async () => {
        if (!currentUserId || !userId) return;

        const chatId = [currentUserId, userId].sort().join('_');

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
            });

        return () => unsubscribe();
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
            // Add message to messages subcollection
            await firestore()
                .collection('Chats')
                .doc(chatId)
                .collection('messages')
                .add(message);

            // Update last message in chat document
            await firestore()
                .collection('Chats')
                .doc(chatId)
                .set({
                    lastMessage: message.text,
                    lastMessageTime: message.createdAt,
                    participants: [currentUserId, userId],
                }, { merge: true });

            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.userId === currentUserId;
        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.otherMessage
            ]}>
                {!isMyMessage && (
                    <TouchableOpacity
                        onPress={() => {
                            if (item.userId !== currentUserId) {
                                navigation.navigate('ProfileUser', { userId: item.userId });
                            }
                        }}
                    >
                        <UpAv cons={item.userId} />
                    </TouchableOpacity>
                )}
                <View style={styles.messageContent}>
                    {!isMyMessage && (
                        <TouchableOpacity
                            onPress={() => {
                                if (item.userId !== currentUserId) {
                                    navigation.navigate('ProfileUser', { userId: item.userId });
                                }
                            }}
                        >
                            <UpName cons={item.userId} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestamp}>
                        {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : ''}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <UpAv cons={userId} />
                    <UpName cons={userId} />
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messagesList}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Nhập tin nhắn..."
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Icon name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    messagesList: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderRadius: 10,
        padding: 10,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        padding: 10,
    },
    messageContent: {
        marginLeft: 10,
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#c65128',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BoxChat; 