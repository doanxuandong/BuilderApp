import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import GetName from './Component/Home/GetName';
import UpAv from './Comment/UpAv';

const HomeScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingPost, setReportingPost] = useState(null);
  const [likes, setLikes] = useState({}); // Lưu trữ trạng thái like của các bài viết

  // Lấy userId khi component mount
  useEffect(() => {
    getUserId();
  }, []);

  // Lấy danh sách bài viết khi component mount hoặc khi userId thay đổi
  useEffect(() => {
    if (userId) {
      GetPost();
      fetchLikes();
    }
  }, [userId]);

  // Hàm lấy userId từ AsyncStorage
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('USERID');
      setUserId(id);
    } catch (error) {
      console.error('Error getting user ID:', error);
      setError('Không thể lấy thông tin người dùng');
    }
  };

  // Hàm lấy danh sách bài viết từ Firestore
  const GetPost = useCallback(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection('Posts')
      .onSnapshot(
        (snapshot) => {
          try {
            const posts = [];
            snapshot.docs.forEach(doc => {
              const postData = doc._data.post;
              if (Array.isArray(postData)) {
                posts.push(...postData);
              }
            });

            // Sắp xếp các bài viết theo thời gian mới nhất lên trên
            posts.sort((a, b) => {
              return b.time.toDate() - a.time.toDate();
            });

            setList(posts);
            setLoading(false);
          } catch (error) {
            console.error('Error processing posts:', error);
            setError('Có lỗi xảy ra khi xử lý bài viết');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error fetching posts:', error);
          setError('Không thể tải bài viết');
          setLoading(false);
        }
      );

    // Cleanup subscription khi component unmount
    return () => unsubscribe();
  }, []);

  // Hàm lấy thông tin like của người dùng hiện tại
  const fetchLikes = useCallback(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('Likes')
      .where('userId', '==', userId)
      .onSnapshot(
        (snapshot) => {
          const likesData = {};
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            likesData[data.postId] = true;
          });
          setLikes(likesData);
        },
        (error) => {
          console.error('Error fetching likes:', error);
        }
      );

    return () => unsubscribe();
  }, [userId]);

  // Hàm xử lý like/unlike bài viết
  const handleLike = useCallback(async (postId) => {
    if (!userId) return;

    try {
      const likeRef = firestore()
        .collection('Likes')
        .doc(`${userId}_${postId}`);

      const likeDoc = await likeRef.get();

      if (likeDoc.exists) {
        // Nếu đã like thì unlike
        await likeRef.delete();
      } else {
        // Nếu chưa like thì like
        await likeRef.set({
          userId: userId,
          postId: postId,
          createdAt: firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Có lỗi xảy ra khi thao tác like');
    }
  }, [userId]);

  // Hàm định dạng thời gian
  const coverTime = useCallback((time) => {
    try {
      const date = time.toDate();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const munis = String(date.getMinutes()).padStart(2, '0');

      return `${dd}/${mm}/${yyyy} ${hh}:${munis}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid date';
    }
  }, []);

  // Hàm xử lý report bài viết
  const handleReport = async () => {
    if (reportingPost && reportReason.trim()) {
      try {
        await firestore().collection('PostReports').add({
          idPost: reportingPost.idPost,
          userId: reportingPost.userId,
          reporterId: userId,
          reason: reportReason,
          time: new Date(),
          postContent: reportingPost.text,
        });

        setReportModalVisible(false);
        setReportReason('');
        setReportingPost(null);
        alert('Đã gửi report!');
      } catch (error) {
        console.error('Error sending report:', error);
        alert('Có lỗi xảy ra khi gửi report');
      }
    }
  };

  // Render item cho FlatList
  const renderItem = useCallback(({ item, index }) => {
    const isLiked = likes[item.idPost] || false;

    return (
      <View style={styles.feedItem}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.postHeader}>
            <UpAv cons={item.userId} />
            <TouchableOpacity
              onPress={() => {
                if (item.userId !== userId) {
                  navigation.navigate('ProfileUser', { userId: item.userId });
                }
              }}
            >
              <View>
                <GetName userId={item.userId} />
                <Text style={styles.time}>{coverTime(item.time)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {userId === item.userId ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate('EditPosts', { item });
              }}
            >
              <Entypo size={15} name='dots-three-vertical' />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                setReportingPost(item);
                setReportModalVisible(true);
              }}
            >
              <Entypo size={15} name='dots-three-vertical' />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.status}>{item.text}</Text>

        {item.img && item.img.length > 0 && (
          <Image
            source={{ uri: item.img }}
            style={styles.postImage}
          />
        )}

        <View style={styles.reactions}>
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => handleLike(item.idPost)}
          >
            <Icon
              name={isLiked ? "thumbs-up" : "thumbs-o-up"}
              size={20}
              color={isLiked ? "#4267B2" : "#666"}
            />
            <Text style={[
              styles.reactionText,
              isLiked && styles.likedText
            ]}>
              {isLiked ? "Đã thích" : "Thích"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => {
              navigation.navigate('ListComment', item);
            }}
          >
            <Icon name="comment" size={20} color="#4267B2" />
            <Text style={styles.reactionText}>Bình luận</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reactionButton}>
            <Icon name="share" size={20} color="#4267B2" />
            <Text style={styles.reactionText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [userId, navigation, coverTime, likes, handleLike]);

  // Render loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c65128" />
      </View>
    );
  }

  // Render error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={GetPost}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ListChat')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.addButton}>
          <Icon name="search" size={32} color="#c65128" />
        </TouchableOpacity>
      </View>

      <View style={{ borderBottomColor: '#c65128', borderBottomWidth: 2 }} />

      <View style={styles.feedContainer}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => `post-${index}`}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>

      <View style={{ borderBottomColor: '#c65128', borderBottomWidth: 2 }} />

      <View style={styles.mainView}>
        <View style={styles.menuBar}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('HomeScreen')}>
            <Icon name="home" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('ListChat')}>
            <Icon name="comments" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bigAddButton} onPress={() => navigation.navigate('AddPostScreen')}>
            <Icon name="plus" size={48} color="#c65128" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('MainScreen')}>
            <Icon name="list" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('UserScreen')}>
            <Icon name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={reportModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do report</Text>
            <TextInput
              placeholder="Nhập lý do..."
              value={reportReason}
              onChangeText={setReportReason}
              style={styles.reportInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setReportModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReport}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>Gửi</Text>
              </TouchableOpacity>
            </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#c65128',
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c65128',
    padding: 10,
  },
  mainView: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    borderRadius: 20,
  },
  feedContainer: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  menuBar: {
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 15,
    borderColor: '#c65128',
    marginTop: 10,
  },
  menuIcon: {
    flex: 1,
    alignItems: 'center',
  },
  bigAddButton: {
    flex: 1,
    alignItems: 'center',
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
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 'auto',
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
  likedText: {
    color: '#4267B2',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 10,
  },
  submitButton: {
    padding: 5,
  },
  submitText: {
    color: '#c65128',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
