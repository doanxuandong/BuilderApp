import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const AddPostScreen = ({ navigation }) => {

  useEffect(() => {
    getName()
  })

  const getName = async () => {
    await firestore()
      .collection('Users')
      .get()
      .then(dt => {
        // console.log(dt, 1);
      })
  }

  const [imageData, setImageData] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [listIma, setListIma] = useState([]);

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });



    if (result.assets != null || result.didCancel == false) {
      setImagePicked(true);
      if (imageData == null) {
        setImageData(result);
      }
      else if (imageData.assets.length >= 1) {
        imageData.assets.push(result.assets[0]);
      }
    }
  };

  const UpLoadImgProDuct = async () => {

    let temp = []
    imageData.assets.forEach(item => {

      const reference = storage().ref(item.fileName);
      const pathToFile = item.uri;
      reference.putFile(pathToFile);
      storage()
        .ref(item.fileName)
        .getDownloadURL()
        .then(dt => {
          temp.push(dt);
          setListIma(temp)
          console.log(dt, 'list hinh');
        })

    });
    SetPost(listIma);
  };

  const [TextPost, setTextPost] = useState();

  const SetPost = async Img => {
    let userId = await AsyncStorage.getItem('USERID', userId);
    let idPost = uuid.v4();
    let PS = ({
      idPost: idPost,
      userId: userId,
      text: TextPost,
      img: Img,
      cmt: [],
      like: [],
      time: new Date(),
    })
    let t = firestore()
      .collection('Posts')
      .doc(userId)
    let check = await t.get()
    if (check.exists) {
      let temp = []
      temp = check._data.post
      temp.push(PS)
      firestore()
        .collection('Posts')
        .doc(userId)
        .set({
          post: temp,
        })
    }
    else {
      let temp = []
      temp.push(PS)
      firestore()
        .collection('Posts')
        .doc(userId)
        .set({
          post: temp,
        })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')} >
          <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="gear" size={30} color="#900" />
        </TouchableOpacity>
      </View>
      <View style={styles.mainView}>
        <View style={styles.feedItem}>
          <View style={styles.postHeader}>
            <Image source={require('./logo.png')} style={styles.avatar} />
            <View>
              <Text style={styles.username}>Đông đóng đồ</Text>
            </View>
          </View>
          <TextInput style={styles.status} placeholder='Nhập Status . . . . .'
            value={TextPost}
            onChangeText={(txt) => {
              setTextPost(txt);
            }}
          ></TextInput>
          <TouchableOpacity style={styles.postImage}
            onPress={() => {
              openGallery()
            }}
          >
            <Text style={styles.uploadImage}>Tải ảnh lên</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            UpLoadImgProDuct();
          }}
          style={styles.postButton}>
          <Text style={styles.TextPost}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
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
    // Add styling for feed items
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
  postButton: {
    backgroundColor: '#c65128',
    borderRadius: 5,
  },
  TextPost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
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
    borderWidth: 1,
  },
  uploadImage: {
    textAlign: 'center',
    marginTop: 85,
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
});

export default AddPostScreen;
