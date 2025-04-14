import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import UpName from './UpName';
import UpAv from './UpAv';

const ItemComment = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={styles.commentContainer}>
                <UpAv cons={item.idUser} />
                <View style={styles.commentContent}>
                    <UpName cons={item.idUser} />
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