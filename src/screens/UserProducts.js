import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProducts = ({ route }) => {
    const { userId } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserProducts();
    }, [userId]);

    const fetchUserProducts = async () => {
        try {
            setLoading(true);
            const snapshot = await firestore()
                .collection('Products')
                .where('userId', '==', userId)
                .get();

            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.materialName}</Text>
                <Text style={styles.productDetail}>Kích thước: {item.materialSize}</Text>
                <Text style={styles.productDetail}>Số lượng: {item.materialQuantity}</Text>
                <Text style={styles.productPrice}>Giá: {item.materialPrice}đ</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#c65128" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchUserProducts}
                >
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#900" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm</Text>
            </View>

            {products.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.noProductsText}>Chưa có sản phẩm nào</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 15,
    },
    productItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    productPrice: {
        fontSize: 16,
        color: '#900',
        fontWeight: 'bold',
        marginTop: 5,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#900',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    retryText: {
        color: 'white',
        fontSize: 14,
    },
    noProductsText: {
        fontSize: 16,
        color: '#666',
    },
});

export default UserProducts; 