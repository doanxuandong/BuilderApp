import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const HomeScreen = ({navigation}) => {
  return (
  <View style={styles.container}>
      <View style={styles.header}> 
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
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
      <ScrollView style={styles.feedContainer}>
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
      </ScrollView>
      <View style={{ borderBottomColor: '#c65128', borderBottomWidth: 2 }} />
      <View style={styles.mainView}>
        <View style={styles.menuBar}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('HomeScreen')}>
            <Icon name="home" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('BookScreen')}>
            <Icon name="book" size={24} color="black" />
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

export default HomeScreen;
