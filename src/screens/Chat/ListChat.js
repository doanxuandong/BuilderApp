import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import ItemChat from './Component/ItemChat';

const sampleData = [
    {
        id: '1',
        avatar: 'https://i.pravatar.cc/150?img=3',
        name: 'Huỳnh Tuấn Anh',
    },
    {
        id: '2',
        avatar: 'https://i.pravatar.cc/150?img=5',
        name: 'Lê Minh Hoàng',
    },
    {
        id: '3',
        avatar: 'https://i.pravatar.cc/150?img=6',
        name: 'Nguyễn Thu Hà',
    },
];
const ListChat = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        // Bạn có thể fetch từ Firestore tại đây
        setChatList(sampleData);
    }, []);

    const renderItem = ({ item }) => (
        <ItemChat
            avatar={item.avatar}
            name={item.name}
            navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 20
                    }}
                >
                    Box chat
                </Text>
            </View>
            <FlatList
                data={chatList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingVertical: 10,
    },
});
export default ListChat;