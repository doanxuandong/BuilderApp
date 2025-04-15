import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import UpName from '../Comment/UpName';
import UpAv from '../Comment/UpAv';

const ListChat = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        getCurrentUserId();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            fetchChats();
        }
    }, [currentUserId]);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    };

    const fetchChats = () => {
        const unsubscribe = firestore()
            .collection('Chats')
            .where('participants', 'array-contains', currentUserId)
            .orderBy('lastMessageTime', 'desc')
            .onSnapshot(snapshot => {
                const chatsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChats(chatsData);
            }, error => {
                console.error('Error fetching chats:', error);
            });

        return () => unsubscribe();
    };

    const getOtherUserId = (participants) => {
        return participants.find(id => id !== currentUserId);
    };

    const renderChatItem = ({ item }) => {
        const otherUserId = getOtherUserId(item.participants);
        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('BoxChat', { userId: otherUserId })}
            >
                <View style={styles.avatarContainer}>
                    <UpAv cons={otherUserId} />
                </View>
                <View style={styles.chatInfo}>
                    <View style={styles.nameAndTime}>
                        <UpName cons={otherUserId} />
                        <Text style={styles.time}>
                            {item.lastMessageTime ? new Date(item.lastMessageTime.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage || 'Chưa có tin nhắn'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
            </View>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 10,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameAndTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
});

export default ListChat;