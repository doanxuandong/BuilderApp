import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import UpName from '../Comment/UpName';
import UpAv from '../Comment/UpAv';

// Tách component ChatItem
const ChatItem = React.memo(({ item, currentUserId, onReport, onPress }) => {
    const otherUserId = useMemo(() =>
        item.participants.find(id => id !== currentUserId),
        [item.participants, currentUserId]
    );

    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => onPress(otherUserId)}
        >
            <View style={styles.avatarContainer}>
                <UpAv cons={otherUserId} />
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.nameAndTime}>
                    <UpName cons={otherUserId} />
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage || 'Chưa có tin nhắn'}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.reportButton}
                onPress={() => onReport(item.id)}
            >
                <Icon name="ellipsis-v" size={20} color="#666" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
});

// Tách component ReportModal
const ReportModal = React.memo(({ visible, onClose, onSubmit, reason, setReason }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Báo cáo cuộc trò chuyện</Text>
                    <TextInput
                        style={styles.reportInput}
                        placeholder="Nhập lý do báo cáo"
                        multiline
                        value={reason}
                        onChangeText={setReason}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.submitButton]}
                            onPress={onSubmit}
                        >
                            <Text style={[styles.buttonText, styles.submitButtonText]}>Gửi báo cáo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const ListChat = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);

    useEffect(() => {
        getCurrentUserId();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            const unsubscribe = fetchChats();
            return () => unsubscribe();
        }
    }, [currentUserId]);

    const getCurrentUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setCurrentUserId(id);
    };

    const fetchChats = useCallback(() => {
        return firestore()
            .collection('Chats')
            .where('participants', 'array-contains', currentUserId)
            .onSnapshot(snapshot => {
                const chatsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChats(chatsData);
            }, error => {
                console.error('Error fetching chats:', error);
            });
    }, [currentUserId]);

    const handleReport = useCallback((chatId) => {
        setSelectedChatId(chatId);
        setReportModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setReportModalVisible(false);
        setReportReason('');
    }, []);

    const submitReport = useCallback(async () => {
        if (!reportReason.trim()) {
            alert('Vui lòng nhập lý do báo cáo');
            return;
        }

        try {
            const chat = chats.find(chat => chat.id === selectedChatId);
            const reportedUserId = chat.participants.find(id => id !== currentUserId);

            await firestore()
                .collection('ReportsChat')
                .add({
                    chatId: selectedChatId,
                    reporterId: currentUserId,
                    reportedUserId: reportedUserId,
                    reason: reportReason,
                    timestamp: firestore.FieldValue.serverTimestamp()
                });

            handleCloseModal();
            alert('Báo cáo đã được gửi thành công');
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Có lỗi xảy ra khi gửi báo cáo');
        }
    }, [reportReason, selectedChatId, currentUserId, chats, handleCloseModal]);

    const handleChatPress = useCallback((userId) => {
        navigation.navigate('BoxChat', { userId });
    }, [navigation]);

    const renderChatItem = useCallback(({ item }) => (
        <ChatItem
            item={item}
            currentUserId={currentUserId}
            onReport={handleReport}
            onPress={handleChatPress}
        />
    ), [currentUserId, handleReport, handleChatPress]);

    const keyExtractor = useCallback(item => item.id, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
            </View>
            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderChatItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <ReportModal
                visible={reportModalVisible}
                onClose={handleCloseModal}
                onSubmit={submitReport}
                reason={reportReason}
                setReason={setReportReason}
            />
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 10,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameAndTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
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
    reportButton: {
        padding: 10,
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    reportInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    submitButton: {
        backgroundColor: '#ff4444',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
    submitButtonText: {
        color: 'white',
    },
});

export default ListChat;