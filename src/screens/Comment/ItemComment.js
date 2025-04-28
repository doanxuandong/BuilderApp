import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpName from './UpName';
import UpAv from './UpAv';

const ItemComment = ({ item, navigation }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    console.log(item, 123)
    useEffect(() => {
        getCurrentUserId();
    }, []);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    }

    const handleUserPress = () => {
        if (item.userId !== currentUserId) {
            navigation.navigate('ProfileUser', { userId: item.userId });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.commentContainer}>
                <TouchableOpacity onPress={handleUserPress}>
                    <UpAv cons={item.userId} />
                </TouchableOpacity>
                <View style={styles.commentContent}>
                    <TouchableOpacity onPress={handleUserPress}>
                        <UpName cons={item.userId} />
                    </TouchableOpacity>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.timestamp}>
                        {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : ''}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    commentContent: {
        flex: 1,
        marginLeft: 10,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default ItemComment