import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import ItemComment from './ItemComment';

let userId = ''
const ListComment = ({ route, navigation }) => {
    const [comments, setComments] = useState([]);
    const { idPost } = route.params
    const { params } = route
    const [textCmt, setTextCmt] = useState("")

    useEffect(() => {
        getId();
        fetchComments();
    }, [])

    // console.log(route.params, 123)

    const getId = async () => {
        userId = await AsyncStorage.getItem('USERID')
    }

    const fetchComments = async () => {
        try {
            const postRef = firestore().collection('Cmt').doc(idPost);
            const docSnapshot = await postRef.get();

            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const addCommentToPost = async () => {
        const postRef = firestore().collection('Cmt').doc(idPost);
        const docSnapshot = await postRef.get();
        const commentObj = {
            userId: userId,
            text: textCmt,
            createdAt: new Date()
        };
        if (docSnapshot.exists) {
            await postRef.update({
                comments: firestore.FieldValue.arrayUnion(commentObj),
            });
            console.log('Đã thêm comment vào bài viết đã tồn tại');
        } else {
            await postRef.set({
                comments: [commentObj],
            });
            console.log('Đã tạo mới bài viết và thêm comment đầu tiên');
        }
        setTextCmt('');
        fetchComments(); // Refresh comments after adding new one
    };

    const renderItem = ({ item }) => (
        <ItemComment item={item} navigation={navigation} />
    );

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    height: 60,
                    backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('HomeSC')
                }}>
                    <Image source={require('../front_end/icons/left.png')}
                        style={{
                            height: 25,
                            width: 25,
                            padding: 10,
                            marginStart: 10,
                            tintColor: 'white',
                        }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Bình luận
                </Text>
                <View style={{ width: 50, height: 50 }} />
            </View>

            <FlatList
                data={comments}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    index.toString();
                }}
                style={{ flex: 1, marginBottom: 60 }}
            />

            <View
                style={{
                    width: '100%',
                    height: 60,
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: 'black',
                }}>
                <TextInput
                    // ref={inputRef}
                    value={textCmt}
                    onChangeText={txt => {
                        setTextCmt(txt);
                    }}
                    placeholder="type comment here..."
                    placeholderTextColor={'gray'}
                    multiline={true}
                    style={{ width: '80%', marginLeft: 20, color: 'black' }}
                />
                <Text
                    style={{
                        marginRight: 10, fontSize: 18, fontWeight: 'bold',
                        color: 'blue',
                    }}
                    onPress={addCommentToPost}>
                    Đăng
                </Text>
            </View>
        </View>
    );
}

export default ListComment