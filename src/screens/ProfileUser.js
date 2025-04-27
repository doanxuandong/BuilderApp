import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpAv from './Comment/UpAv';
import GetName from './Component/Home/GetName';

const ProfileUser = ({ navigation, route }) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [IMG, setIMG] = useState('')
    const [name, setName] = useState()
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const targetUserId = route.params.userId;

    useEffect(() => {
        getCurrentUserId();
        getUser();
    }, []);

    useEffect(() => {
        if (!targetUserId) return;

        setLoading(true);
        const unsubscribe = firestore()
            .collection('Posts')
            .doc(targetUserId)
            .onSnapshot(
                (documentSnapshot) => {
                    setLoading(false);
                    if (documentSnapshot.exists) {
                        const postsData = documentSnapshot.data().post || [];
                        const sortedPosts = postsData.sort((a, b) => b.time.toDate() - a.time.toDate());
                        setPosts(sortedPosts);
                    } else {
                        setPosts([]);
                    }
                },
                (error) => {
                    console.error('Error fetching posts:', error);
                    setError('Không thể tải bài viết. Vui lòng thử lại sau.');
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [targetUserId]);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    }

    const getUser = async () => {
        let temp
        await firestore()
            .collection('Users')
            .doc(targetUserId)
            .get()
            .then(dt => {
                console.log(dt._data)
                temp = dt._data
            })
        setIMG(temp.pic)
        setName(temp.name)
    }

    const coverTime = time => {
        let date = time.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();
        let hh = date.getHours();
        if (dd < '10') dd = '0' + dd;
        if (mm < '10') mm = '0' + mm;
        if (hh < '10') hh = '0' + hh;
        if (munis < '10') munis = '0' + munis;
        date = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + munis;
        return date;
    };

    const renderPost = ({ item }) => (
        <View style={styles.feedItem}>
            <View style={styles.postHeader}>
                <UpAv cons={item.userId} />
                <View>
                    <GetName userId={item.userId} />
                    <Text style={styles.time}>{coverTime(item.time)}</Text>
                </View>
            </View>
            <Text style={styles.status}>{item.text}</Text>
            {item.img && item.img.length > 0 && (
                <Image source={{ uri: item.img }} style={styles.postImage} />
            )}
            <View style={styles.reactions}>
                <TouchableOpacity style={styles.reactionButton}>
                    <Icon name="thumbs-up" size={20} color="#4267B2" />
                    <Text style={styles.reactionText}>React</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                    <Icon name="comment" size={20} color="#4267B2" />
                    <Text style={styles.reactionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reactionButton}>
                    <Icon name="share" size={20} color="#4267B2" />
                    <Text style={styles.reactionText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const toggleDropdown = () => {
        setIsDropdownVisible(prevState => !prevState);
    };

    const closeDropdown = () => {
        setIsDropdownVisible(false);
    };

    const [avatarSource, setAvatarSource] = useState(null);

    const [imageData, setImageData] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);
    const [listIma, setListIma] = useState();

    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
        UpLoadImgProDuct();
    };

    const UpLoadImgProDuct = async () => {

        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        // uploads file
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        setPic(url)
    };

    const setPic = async url => {
        await firestore()
            .collection('Users')
            .doc(userId)
            .update({
                pic: url
            })
    }
    console.log(IMG);

    const handleViewProducts = () => {
        navigation.navigate('UserProducts', { userId: targetUserId });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#c65128" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            getUser();
                        }}
                    >
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (posts.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.noPostText}>Chưa có bài viết nào</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
            />
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerbar}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')} >
                    <Icon name="arrow-left" size={30} color="#900" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={styles.headerTitle}>BuilderApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon} onPress={toggleDropdown}>
                    <Icon name="gear" size={30} color="#900" />
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDropdownVisible}
                onRequestClose={() => {
                    setIsDropdownVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Login')}>
                        <Icon name="user" size={20} color="#900" />
                        <Text style={styles.dropdownText}>Chuyển tài khoản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Login')}>
                        <Icon name="sign-out" size={20} color="#900" />
                        <Text style={styles.dropdownText}>Đăng xuất</Text>
                    </TouchableOpacity>

                </View>

            </Modal>
            <View style={styles.header}>

                <TouchableOpacity onPress={() => {
                    openGallery()
                }}>
                    <View style={styles.avatarContainer}>
                        {IMG != '' ? (
                            <Image
                                source={{ uri: IMG }}
                                style={styles.avatar}
                            />
                        ) : (
                            <Image
                                source={{ uri: 'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-6/435082593_1478268812724824_5095881726381349763_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGn9BBMdnJFkdHcmDb5V3xu6ZJhs5cXN_DpkmGzlxc38Jx6_L-JNmOAB93mV25gcEHWBv5GUE2UjtZ0wye4Odc1&_nc_ohc=wuyCN_EV0XEAb5vRqSG&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfAYA-gSarpBZ4l48mDUaFRBluLSKx-hCRpwnScsfIxtjg&oe=6626E911' }}
                                style={styles.avatar}
                            />
                        )}
                        <Text style={styles.TextName}>{name}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.menuFl}>
                    <TouchableOpacity style={styles.menuButton}>
                        <Text style={styles.menuFlText}>Following:50</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.menuFlText}>Follow: 1000</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menu}>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate('BoxChat', { userId: targetUserId });
                        }}
                    >
                        <Text style={styles.menuText}>Nhắn tin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleViewProducts}
                    >
                        <Text style={styles.menuText}>Sản phẩm</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c65128',
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerIcon: {
        padding: 5,
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 150,
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
    },
    TextName: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    dropdown: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 60, // adjust this value as needed
        right: 10, // adjust this value as needed
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    dropdownText: {
        marginLeft: 10,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
    },
    menuFl: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    menuFlText: {
        marginHorizontal: 30,
        fontWeight: 'bold',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#c65128',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    retryText: {
        color: 'white',
        fontSize: 14,
    },
    noPostText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProfileUser;
