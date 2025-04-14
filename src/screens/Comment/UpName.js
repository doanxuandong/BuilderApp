import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';



const UpName = (props) => {

    const [name, setName] = useState('');
    
    const Name = async userId => {
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setName(documentSnapshot.data().name);
                }
            });
    }



    let userId = props.cons;
    Name(userId);
    return (
        <Text
            style={{ fontSize: 18, marginLeft: 15, fontWeight: '600', color: 'black' }}>
            {name}
        </Text>
    )
}

export default UpName;