import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportCounts, setReportCounts] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [reportDetails, setReportDetails] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchUsersAndReports = async () => {
            try {
                // Fetch users
                const usersSnapshot = await firestore().collection('Users').get();
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);

                // Fetch and count reports for each user
                const counts = {};
                for (const user of usersData) {
                    // Count PostReports
                    const postReportsSnapshot = await firestore()
                        .collection('PostReports')
                        .where('reportedUserId', '==', user.id)
                        .get();

                    // Count ReportsChat
                    const chatReportsSnapshot = await firestore()
                        .collection('ReportsChat')
                        .where('reportedUserId', '==', user.id)
                        .get();

                    counts[user.id] = {
                        postReports: postReportsSnapshot.size,
                        chatReports: chatReportsSnapshot.size,
                        total: postReportsSnapshot.size + chatReportsSnapshot.size
                    };
                }
                setReportCounts(counts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchUsersAndReports();
    }, []);

    const handleDelete = (userId) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa tài khoản này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa', style: 'destructive', onPress: async () => {
                    await firestore().collection('Users').doc(userId).delete();
                }
            }
        ]);
    };

    const handleUserPress = async (user) => {
        setSelectedUser(user);
        setModalVisible(true);

        try {
            // Fetch PostReports
            const postReportsSnapshot = await firestore()
                .collection('PostReports')
                .where('reportedUserId', '==', user.id)
                .get();

            const postReports = postReportsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'post'
            }));

            // Fetch ReportsChat
            const chatReportsSnapshot = await firestore()
                .collection('ReportsChat')
                .where('reportedUserId', '==', user.id)
                .get();

            const chatReports = chatReportsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'chat'
            }));

            // Combine and sort by timestamp
            const allReports = [...postReports, ...chatReports].sort((a, b) =>
                b.timestamp?.toDate() - a.timestamp?.toDate()
            );

            setReportDetails(allReports);
        } catch (error) {
            console.error('Error fetching report details:', error);
        }
    };

    const renderReportItem = ({ item }) => (
        <View style={styles.reportItem}>
            <Text style={styles.reportType}>
                {item.type === 'post' ? 'Báo cáo bài viết' : 'Báo cáo chat'}
            </Text>
            <Text style={styles.reportReason}>Lý do: {item.reason}</Text>
            {item.description && (
                <Text style={styles.reportDescription}>Mô tả: {item.description}</Text>
            )}
            <Text style={styles.reportDate}>
                Thời gian: {item.timestamp?.toDate().toLocaleString()}
            </Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleUserPress(item)}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name || item.userName}</Text>
                <Text style={styles.info}>SĐT: {item.phone}</Text>
                <Text style={styles.info}>Email: {item.email}</Text>
                <Text style={styles.info}>Loại: {item.type === '0' ? 'Admin' : 'User'}</Text>
                <Text style={styles.reportInfo}>
                    Số lần bị báo cáo: {reportCounts[item.id]?.total || 0}
                    {reportCounts[item.id]?.total > 0 && (
                        ` (Bài viết: ${reportCounts[item.id]?.postReports}, Chat: ${reportCounts[item.id]?.chatReports})`
                    )}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý tài khoản</Text>
            {loading ? <Text>Đang tải...</Text> : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Chi tiết báo cáo - {selectedUser?.name || selectedUser?.userName}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.reportList}>
                            {reportDetails.length > 0 ? (
                                reportDetails.map((report) => (
                                    <View key={report.id} style={styles.reportItem}>
                                        <Text style={styles.reportType}>
                                            {report.type === 'post' ? 'Báo cáo bài viết' : 'Báo cáo chat'}
                                        </Text>
                                        <Text style={styles.reportReason}>Lý do: {report.reason}</Text>
                                        {report.description && (
                                            <Text style={styles.reportDescription}>Mô tả: {report.description}</Text>
                                        )}
                                        <Text style={styles.reportDate}>
                                            Thời gian: {report.timestamp?.toDate().toLocaleString()}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noReports}>Không có báo cáo nào</Text>
                            )}
                        </ScrollView>
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
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 14,
        color: '#555',
    },
    reportInfo: {
        fontSize: 14,
        color: '#e74c3c',
        marginTop: 5,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c65128',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    reportList: {
        maxHeight: '100%',
    },
    reportItem: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    reportType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c65128',
        marginBottom: 5,
    },
    reportReason: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    reportDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    reportDate: {
        fontSize: 12,
        color: '#888',
    },
    noReports: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
});

export default ManageAccounts; 