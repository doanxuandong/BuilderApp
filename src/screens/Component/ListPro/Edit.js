import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const Edit = () => {
    typeEdit = 1
    if (typeEdit === 1) {
        return ( // delete
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editingMaterial ? 'Sửa thông tin vật liệu' : 'Thêm vật liệu mới'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tên vật liệu"
                        value={editingMaterial ? editingMaterial.name : materialName}
                        onChangeText={text => setMaterialName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Kích thước"
                        value={editingMaterial ? editingMaterial.size : materialSize}
                        onChangeText={text => setMaterialSize(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Số lượng"
                        value={editingMaterial ? editingMaterial.quantity : materialQuantity}
                        onChangeText={text => setMaterialQuantity(text)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Giá tiền"
                        value={editingMaterial ? editingMaterial.price : materialPrice}
                        onChangeText={text => setMaterialPrice(text)}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleEditModalSave}>
                        <Text style={styles.buttonText}>{editingMaterial ? 'Lưu' : 'Hoàn thành'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
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
    iconImage: {
        width: 30,
        height: 30,
    },
    materialList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    materialListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        alignSelf: 'center',
    },
    addButton: {
        width: '80%',
        height: 40,
        backgroundColor: '#c65128',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#c65128',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    deleteButton: {
        backgroundColor: '#c65128',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    materialItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#c65128',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Edit;