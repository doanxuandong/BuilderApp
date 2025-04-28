import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const UpName = (props) => {
    const [name, setName] = useState('');

    useEffect(() => {
        const Name = async () => {
            try {
                const userId = props.cons;
                const docSnapshot = await firestore()
                    .collection('Users')
                    .doc(userId)
                    .get();

                if (docSnapshot.exists) {
                    setName(docSnapshot.data().name);
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        Name();
    }, [props.cons]);

    return (
        <Text style={{ fontSize: 18, marginLeft: 15, fontWeight: '600', color: 'black' }}>
            {name}
        </Text>
    );
}

export default UpName;