import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const UpAv = (props) => {
    const [av, setAv] = useState('');

    const Avatar = async userId => {
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setAv(documentSnapshot.data().pic);
                }

            });
    }

    let userId = props.cons;
    Avatar(userId);

    return (
        av != '' ? (
            <Image
                source={{ uri: av }}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    // marginLeft: 10,
                }}
            />
        ) : (
            <Image
                source={require('../images/user.png')}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginLeft: 15,
                }}
            />
        )
    )
}

export default UpAv;