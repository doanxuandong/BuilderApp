import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const GetAvata = (props) => {

    useEffect(() => {
        getAvata()
    }, [])
    const [ava, setAva] = useState()
    // console.log(props)
    const getAvata = async () => {
        let temp
        let doit = await firestore()
            .collection('Users')
            .doc(props.userId)
            .get()
            .then(dt => {
                temp = dt._data.Ava
            })
        setAva(temp)
    }
    return (
        <Text style={styles.username}>{Ava}</Text>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c65128',
        padding: 10,
    },
    mainView: {
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerIcon: {
        padding: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 16,
    },
    addButton: {
        padding: 10,
        borderRadius: 20,
    },
    feedContainer: {
        flex: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        // Add styling for feed items
    },
    menuBar: {
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 15,
        borderColor: '#c65128',
        marginTop: 10,
    },
    menuIcon: {
        flex: 1,
        alignItems: 'center',
    },
    bigAddButton: {
        flex: 1,
        alignItems: 'center',
    },
    feedItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    status: {
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 5,
    },
    reactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reactionText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
    },
});



export default GetAvata;