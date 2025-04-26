import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import UpName from '../Comment/UpName';
import UpAv from '../Comment/UpAv';

const ReportDetailScreen = ({ route, navigation }) => {
    const { reportedUserId } = route.params;
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchUserReports();
    }, [reportedUserId]);

    const fetchUserReports = () => {
        return firestore()
            .collection('ReportsChat')
            .where('reportedUserId', '==', reportedUserId)
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                const reportsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReports(reportsData);
            }, error => {
                console.error('Error fetching user reports:', error);
            });
    };

    const handleDelete = async (reportId) => {
        try {
            await firestore()
                .collection('ReportsChat')
                .doc(reportId)
                .delete();
            Alert.alert('Thành công', 'Đã xóa báo cáo');
        } catch (error) {
            console.error('Error deleting report:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa báo cáo');
        }
    };

    const renderReportItem = ({ item }) => {
        return (
            <View style={styles.reportItem}>
                <View style={styles.reportDetails}>
                    <Text style={styles.reportReason}>Lý do: {item.reason}</Text>
                    <Text style={styles.reportTime}>
                        {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'N/A'}
                    </Text>
                    <Text style={styles.reporterInfo}>
                        Người báo cáo: <UpName cons={item.reporterId} />
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.buttonText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết báo cáo</Text>
            </View>
            <View style={styles.userInfo}>
                <UpAv cons={reportedUserId} />
                <View style={styles.userDetails}>
                    <UpName cons={reportedUserId} />
                    <Text style={styles.reportCount}>Số lần bị báo cáo: {reports.length}</Text>
                </View>
            </View>
            {reports.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có báo cáo nào</Text>
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderReportItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const ManageReposts = ({ navigation }) => {
    const [reportedUsers, setReportedUsers] = useState([]);

    useEffect(() => {
        fetchReportedUsers();
    }, []);

    const fetchReportedUsers = () => {
        return firestore()
            .collection('ReportsChat')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                const reportsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const userReports = reportsData.reduce((acc, report) => {
                    if (!acc[report.reportedUserId]) {
                        acc[report.reportedUserId] = {
                            userId: report.reportedUserId,
                            reportCount: 0,
                            latestReport: report
                        };
                    }
                    acc[report.reportedUserId].reportCount++;
                    return acc;
                }, {});

                setReportedUsers(Object.values(userReports));
            }, error => {
                console.error('Error fetching reported users:', error);
            });
    };

    const handleDeleteUser = async (userId) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel'
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Xóa tất cả báo cáo liên quan đến user này
                            const reportsSnapshot = await firestore()
                                .collection('ReportsChat')
                                .where('reportedUserId', '==', userId)
                                .get();

                            const batch = firestore().batch();
                            reportsSnapshot.docs.forEach(doc => {
                                batch.delete(doc.ref);
                            });

                            // Xóa tài khoản user
                            await firestore()
                                .collection('Users')
                                .doc(userId)
                                .delete();

                            await batch.commit();
                            Alert.alert('Thành công', 'Đã xóa tài khoản và các báo cáo liên quan');
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa tài khoản');
                        }
                    }
                }
            ]
        );
    };

    const renderUserItem = ({ item }) => {
        return (
            <View style={styles.userItem}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => navigation.navigate('ReportDetail', { reportedUserId: item.userId })}
                >
                    <UpAv cons={item.userId} />
                    <View style={styles.userDetails}>
                        <UpName cons={item.userId} />
                        <Text style={styles.reportCount}>Số lần bị báo cáo: {item.reportCount}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteUserButton}
                    onPress={() => handleDeleteUser(item.userId)}
                >
                    <Text style={styles.deleteUserText}>Xóa tài khoản</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý báo cáo tin nhắn</Text>
            </View>
            {reportedUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có báo cáo nào</Text>
                </View>
            ) : (
                <FlatList
                    data={reportedUsers}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.userId}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    listContainer: {
        padding: 10,
    },
    userItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userDetails: {
        marginLeft: 10,
        flex: 1,
    },
    reportCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    reportItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    reportDetails: {
        flex: 1,
    },
    reportReason: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    reportTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    reporterInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    deleteUserButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#ff4444',
        marginLeft: 10,
    },
    deleteUserText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ManageReposts;
export { ReportDetailScreen }; 