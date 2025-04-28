import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const UpAv = (props) => {
    const [av, setAv] = useState('');

    useEffect(() => {
        const Avatar = async () => {
            try {
                const userId = props.cons;
                const docSnapshot = await firestore()
                    .collection('Users')
                    .doc(userId)
                    .get();

                if (docSnapshot.exists) {
                    setAv(docSnapshot.data().pic);
                }
            } catch (error) {
                console.error('Error fetching user avatar:', error);
            }
        };

        Avatar();
    }, [props.cons]);

    return (
        av ? (
            <Image
                source={{ uri: av }}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
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
    );
}

export default UpAv;