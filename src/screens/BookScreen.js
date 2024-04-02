import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const BookScreen = ({navigation}) => {
  const handlePress = (item) => {
    console.log("Pressed item:", item);
  };

  const items = [
    { id: 1, title: "Loại nhà" },
    { id: 2, title: "Săt thép" },
    { id: 3, title: "Gạch xây" },
    { id: 4, title: "Gạch lát nền" },
    { id: 4, title: "Gạch ốp tường" },
    { id: 4, title: "TBVS" },
    { id: 4, title: "Bếp" },
    { id: 4, title: "Phong thủy" },
    { id: 4, title: "Xi măng" },
    { id: 4, title: "Cát" },
    { id: 4, title: "Keo dán gạch" },
    { id: 4, title: "Sơn" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerbar}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')} >
            <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity> 
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('BrickCalculator')}>
            <Icon name="laptop" size={30} color="#900" />
        </TouchableOpacity> 
      </View>
      <View style={styles.MainView} >
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
        <Text style={styles.header}>Cẩm nang xây dựng</Text>
          <View style={styles.menu}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
      </View>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  MainView: {
    paddingHorizontal: 20,
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
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '48%', 
    aspectRatio: 1, 
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: '2%', 
  },
  itemText: {
    fontSize: 18,
  },
});

export default BookScreen;
