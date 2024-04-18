import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

const UserScreen = ({navigation}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const [avatarSource, setAvatarSource] = useState(null);

  const handleAvatarPress = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setAvatarSource(response.uri);
      }
    });
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
        <TouchableOpacity onPress={handleAvatarPress}>
          <View style={styles.avatarContainer}>
          {avatarSource ? (
              <Image
                source={{ uri: avatarSource }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={{ uri: 'https://scontent.fsgn16-1.fna.fbcdn.net/v/t39.30808-1/411916691_1420161541912504_6983007839921214016_n.jpg?stp=dst-jpg_s320x320&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE9b4anm92_S5Qp38YDkGFPIVDLoX2h38QhUMuhfaHfxMyuFPxKNqqBRiZNL89UBSnXN3z5Ho3d9xXqR5uK2Y7K&_nc_ohc=_56zRvuZoiwAX-8fum7&_nc_ht=scontent.fsgn16-1.fna&oh=00_AfBlW-9_w62I1m-ZWUq0g8xLJud-fAxkKKZaALwNtN0VZg&oe=66000DC8' }}
                style={styles.avatar}
              />
            )}
            <Text style={styles.TextName}>Đoàn Xuân Đông</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.menuFl}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuFlText}>Following:50</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.menuFlText} >Follow: 1000</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.menuFlText} >Like: 400</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileScreen')}>
            <Text style={styles.menuText}>Thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Bài viết</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.feedItem}>
              <View style={styles.postHeader}>
                <Image source={ require('./logo.png') } style={styles.avatar} />
                <View>
                  <Text style={styles.username}>Doan Xuan Dong</Text>
                  <Text style={styles.time}>2 phút</Text>
                </View>
              </View>
              <Text style={styles.status}>Love Ruby</Text>
              <Image source={require('./logo.png')} style={styles.postImage} />
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
    justifyContent:'center',
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
});

export default UserScreen;
