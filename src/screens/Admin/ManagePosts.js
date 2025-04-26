import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            const snapshot = await firestore().collection('Posts').get();
            let allPosts = [];
            snapshot.docs.forEach(doc => {
                const userId = doc.id;
                const postArr = doc.data().post || [];
                postArr.forEach(post => {
                    if (post.idPost) allPosts.push({ ...post, userId });
                });
            });
            setPosts(allPosts);
        } catch (e) {
            console.log('Error fetchAllPosts', e);
        }
        setLoading(false);
    };

    const handleDelete = (userId, idPost) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa bài viết này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa', style: 'destructive', onPress: async () => {
                    const userDoc = await firestore().collection('Posts').doc(userId).get();
                    let postArr = userDoc.data().post || [];
                    postArr = postArr.filter(post => post.idPost !== idPost);
                    await firestore().collection('Posts').doc(userId).set({ post: postArr });
                    fetchAllPosts();
                }
            }
        ]);
    };

    const handleShowReports = async (post) => {
        setSelectedPost(post);
        setReportModalVisible(true);
        // Lấy các report liên quan đến bài viết này
        const snapshot = await firestore().collection('PostReports').where('idPost', '==', post.idPost).get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(data);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleShowReports(item)}>
            <View style={styles.itemContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titleText}>{item.text || 'Không có nội dung'}</Text>
                    {item.img && typeof item.img === 'string' && item.img.trim() !== '' ? (
                        <Image source={{ uri: item.img }} style={styles.postImage} />
                    ) : null}
                    <Text style={styles.info}>Tác giả: {item.userId}</Text>
                    <Text style={styles.info}>Ngày đăng: {item.time ? new Date(item.time.toDate ? item.time.toDate() : item.time).toLocaleString() : 'Không rõ'}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.userId, item.idPost)}>
                    <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý bài viết</Text>
            {loading ? <Text>Đang tải...</Text> : (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.idPost}
                />
            )}
            <Modal visible={reportModalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Report cho bài viết</Text>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{selectedPost?.text}</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {reports.length === 0 ? (
                                <Text>Không có report nào cho bài viết này.</Text>
                            ) : reports.map(report => (
                                <View key={report.id} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Lý do: {report.reason}</Text>
                                    <Text>Người report: {report.reporterId}</Text>
                                    <Text>Thời gian: {report.time ? new Date(report.time.toDate ? report.time.toDate() : report.time).toLocaleString() : ''}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setReportModalVisible(false)} style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                            <Text style={{ color: '#c65128', fontWeight: 'bold' }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#c65128',
        marginBottom: 20,
        alignSelf: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        color: '#555',
    },
    postImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ManagePosts; 