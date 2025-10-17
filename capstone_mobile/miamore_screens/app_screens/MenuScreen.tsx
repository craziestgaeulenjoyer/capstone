import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
    { id: "1", name: "All" },
    { id: "2", name: "Featured" },
    { id: "3", name: "Coffee", sub: ["Iced Coffee", "Hot Coffee"] },
    { id: "4", name: "Snacks" },
    { id: "5", name: "Croffle" },
    { id: "6", name: "Milk" },
    { id: "7", name: "Platters", sub: ["Big Platters", "Solo Platters"] },
];

const products = [
    {
        id: "1",
        name: "Brewed Hot Coffee",
        prices: {
            small: 45,
            medium: 50,
            large: 55,
        },
        category: "Coffee",
        subcategory: "Hot Coffee",
        description: "Aromatic and simply brewed. A great, warm start to a morning.",
        priceSmall: 45,
        priceMedium: 50,
        priceLarge: 55,
        image: require("../../assets/BrewedHotCoffee.png"),
        imageFile: "BrewedHotCoffee.png",
    },
    {
        id: "2",
        name: "Brewed Iced Coffee",
        prices: {
            small: 50,
            medium: 55,
            large: 60,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Brewed to perfection. Served cold and simple.",
        priceSmall: 50,
        priceMedium: 55,
        priceLarge: 60,
        image: require("../../assets/BrewedIcedCoffee.png"),
        imageFile: "BrewedIcedCoffee.png",
    },
    {
        id: "3",
        name: "Cappuccino",
        prices: {
            small: 60,
            medium: 65,
            large: 70,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Cappuccino.",
        priceSmall: 60,
        priceMedium: 65,
        priceLarge: 70,
        image: require("../../assets/Cappuccino.png"),
        imageFile: "Cappuccino.png",
    },
    {
        id: "4",
        name: "Caramel Iced Coffee",
        prices: {
            small: 50,
            medium: 55,
            large: 60,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Caramel Iced Coffee",
        priceSmall: 50,
        priceMedium: 55,
        priceLarge: 60,
        image: require("../../assets/CaramelIcedCoffee.png"),
        imageFile: "CaramelIcedCoffee.png",
    },
    {
        id: "5",
        name: "Classic Iced Coffee",
        prices: {
            small: 55,
            medium: 60,
            large: 65,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Bold, smooth & refreshing. A timeless favorite served over ice.",
        priceSmall: 55,
        priceMedium: 60,
        priceLarge: 65,
        image: require("../../assets/ClassicIcedCoffee.png"),
        imageFile: "ClassicIcedCoffee.png",
    },
    {
        id: "6",
        name: "French Vanilla Iced Coffee",
        prices: {
            small: 65,
            medium: 70,
            large: 75,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Smooth and creamy with a hint of vanilla for a refreshing treat.",
        priceSmall: 65,
        priceMedium: 70,
        priceLarge: 75,
        image: require("../../assets/FrenchVanillaIcedCoffee.png"),
        imageFile: "FrenchVanillaIcedCoffee.png",
    },
    {
        id: "7",
        name: "Caramel Iced Coffee",
        prices: {
            small: 65,
            medium: 70,
            large: 75,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "A sweet blend of coffee and buttery caramel, perfectly chilled.",
        priceSmall: 65,
        priceMedium: 70,
        priceLarge: 75,
        image: require("../../assets/Caramel.png"),
        imageFile: "Caramel.png",
    },
    {
        id: "8",
        name: "Hazelnut Iced Coffee",
        prices: {
            small: 65,
            medium: 70,
            large: 75,
        },
        category: "Coffee",
        subcategory: "Iced Coffee",
        description: "Rich coffee with a nutty hazelnut twist for a smooth, flavorful sip.",
        priceSmall: 65,
        priceMedium: 70,
        priceLarge: 75,
        image: require("../../assets/HazelnutIcedCoffee.png"),
        imageFile: "HazelnutIcedCoffee.png",
    },
    {
        id: "9",
        name: "Platter 1",
        prices: {
            small: 350,
            medium: 400,
            large: 500,
        },
        category: "Platters",
        subcategory: "Solo Platters",
        description: "A platter for yourself to enjoy. Contains fries, hashbrowns and cheesesticks.",
        priceSmall: 350,
        priceMedium: 400,
        priceLarge: 500,
        image: require("../../assets/Platter1.png"),
        imageFile: "Platter1.png",
    },
];

const MenuScreen: React.FC = () => {  
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSub, setSelectedSub] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<"small" | "medium" | "large">("small");
    const [notes, setNotes] = useState("");

    const openModal = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1);
        setSize("small");
    };

    const closeModal = () => setSelectedProduct(null);

    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            selectedCategory === "All" || p.category === selectedCategory;
        const matchesSub = !selectedSub || p.subcategory === selectedSub;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSub && matchesSearch;
    });

    const basePrice = selectedProduct?.prices
    ? Number(selectedProduct.prices[size]).toFixed(2)  
    : "0.00";

    const totalPrice = (Number(basePrice) * quantity).toFixed(2);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../assets/MiAmore2.png')} style={styles.logo} />
                <Text style={styles.headerTitle}>Menu</Text>
                <View style={styles.headerIcons}>
                    <Icon name="mic-outline" size={24} color="#000" style={styles.icon} />
                    <Icon name="notifications-outline" size={24} color="#000" />
                </View>
            </View>
            <Text style={styles.headerText}>Our Menu</Text>
            <Text style={styles.subHeaderText}>Special For You</Text>

            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#121212"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[
                    styles.categoryContainer,
                    !categories.find((c) => c.name === selectedCategory)?.sub && { height: 60 }
                ]}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                        styles.categoryChip,
                        selectedCategory === cat.name && styles.categoryChipActive,
                        ]}
                        onPress={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSub(null);
                        }}
                    >
                        <Text
                        style={
                            selectedCategory === cat.name
                            ? styles.categoryTextActive
                            : styles.categoryText
                        }
                        >
                        {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {categories.find((c) => c.name === selectedCategory)?.sub && (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subCategoryContainer}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {categories
                .find((c) => c.name === selectedCategory)
                ?.sub?.map((sub) => (
                    <TouchableOpacity
                    key={sub}
                    style={[
                        styles.subChip,
                        selectedSub === sub && styles.subChipActive,
                    ]}
                    onPress={() => setSelectedSub(sub)}
                    >
                    <Text
                        style={
                        selectedSub === sub ? styles.subTextActive : styles.subText
                        }
                    >
                        {sub}
                    </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            )}

            <View style={{ flex: 1 }}>
                {filteredProducts.length > 0 ? (
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => openModal(item)}
                            >
                                <Image source={item.image} style={styles.cardImage} />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <Text style={styles.cardPrice}>
                                    ₱{item.priceSmall}/{item.priceMedium}/{item.priceLarge}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery
                            ? `No products found for "${searchQuery}".`
                            : "No products for this category."}
                        </Text>
                    </View>
                )}
            </View>

            <Modal visible={!!selectedProduct} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                     <Icon name="close" size={24} color="#76B13A" />
                    </TouchableOpacity>
                    {selectedProduct && (
                    <>
                        <View style={{ alignItems: "center" }}>
                            <Image source={selectedProduct.image} style={styles.modalImage} />
                        </View>

                        <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                        <Text style={styles.modalPrice}>
                        ₱{selectedProduct.priceSmall}/{selectedProduct.priceMedium}/{selectedProduct.priceLarge}
                        </Text>
                        <Text style={styles.modalDescription}>
                        {selectedProduct.description}
                        </Text>

                        {/* Quantity */}
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityBox}>
                            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Text style={styles.qtyBtn}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.qtyValue}>{quantity}</Text>

                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                                <Text style={styles.qtyBtn}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Size */}
                        <Text style={styles.sectionTitle}>Select options</Text>
                        <View style={styles.sizeSelector}>
                            {["small", "medium", "large"].map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.sizeBtn, size === s && styles.sizeBtnActive]}
                                onPress={() => setSize(s as "small" | "medium" | "large")}
                            >
                                <Text style={{ color: size === s ? "#fff" : "#000" }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>

                        {/* Add-Ons */}
                        <Text style={styles.sectionTitle}>What's included</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Add special instructions..."
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                            onChangeText={setNotes}
                        />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={async () => {
                                    try {
                                    const token = await AsyncStorage.getItem("token");
                                    console.log("Adding to cart:", {
                                        id: selectedProduct.id,
                                        name: selectedProduct.name,
                                        size,
                                        quantity,
                                        notes,
                                        basePrice,
                                        totalPrice,
                                        image: selectedProduct.image,
                                    });
                                    const response = await fetch("http://10.0.2.2:5000/api/cart", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            product_id: selectedProduct.id,
                                            product_name: selectedProduct.name,
                                            size,
                                            quantity,
                                            instructions: notes,
                                            price: basePrice,
                                            image: selectedProduct.imageFile,
                                        }),
                                    });

                                    const raw = await response.text();
                                    let data;
                                    try {
                                        data = JSON.parse(raw);
                                    } catch {
                                        data = null;
                                    }

                                    if (response.ok) {
                                        setModalMessage("Added to cart!");
                                        setModalVisible(true);
                                        closeModal();
                                    } else {
                                        setModalMessage(data?.message || raw || "Error adding to cart");
                                        setModalVisible(true);
                                    }
                                    } catch (err) {
                                    console.error(err);
                                    setModalMessage(err.message || "Something went wrong");
                                    setModalVisible(true);
                                    }
                                }}
                                >
                                <Text style={{ color: "#76B13A", fontSize: 16, fontWeight: "700" }}>
                                    Add to Cart
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.orderBtn}>
                                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Order Now</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    )}
                </View>
                </View>
            </Modal>

            <View style={styles.bottomTabs}>
                {["Home", "Nearby", "Menu", "Cart", "Profile"].map((tab, i) => (
                    <TouchableOpacity
                    key={i}
                    style={styles.tabItem}
                    onPress={() => {
                        if (tab === "Menu") navigation.navigate("Menu" as never);
                        else if (tab === "Home") navigation.navigate("Home" as never);
                        else if (tab === "Nearby") navigation.navigate("Nearby" as never);
                        else if (tab === "Cart") navigation.navigate("Cart" as never);
                        else if (tab === "Profile") navigation.navigate("Profile" as never);
                    }}
                    >
                    <Icon
                        name={
                        tab === "Menu"
                            ? "restaurant"
                            : tab === "Nearby"
                            ? "location-outline"
                            : tab === "Home"
                            ? "home-outline"
                            : tab === "Cart"
                            ? "cart-outline"
                            : "person-outline"
                        }
                        size={22}
                        color={tab === "Menu" ? "#73C04D" : "#999"}
                    />
                    <Text
                        style={[
                        styles.tabText,
                        { color: tab === "Menu" ? "#73C04D" : "#999" },
                        ]}
                    >
                        {tab}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                    >
                    <View style={styles.validityModalOverlay}>
                        <View style={styles.validityModalBox}>
                        <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
                            {modalMessage}
                        </Text>
                        <TouchableOpacity
                            style={styles.validityModalBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        </View>
    );
};

export default MenuScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    logo: {
        width: 65,
        height: 65,
        resizeMode: 'contain',
    },
    headerTitle: { fontSize: 24, fontWeight: "bold", fontFamily: 'Montserrat-Bold', },
    headerIcons: { flexDirection: "row" },
    icon: { marginRight: 24 },

    headerText: {
        marginLeft: 22,
        fontSize: 13,
        fontWeight: '400',
    },
    subHeaderText: {
        marginLeft: 22,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: "700",
        color: "#76b13a",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 27,
        marginBottom: 14,
        backgroundColor: "#cccccc",
        borderColor: "#8c8c8c",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
        elevation: 10, 
        fontFamily: 'Montserrat',
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#000", fontFamily: 'Montserrat', },

    categoryContainer: {
        marginBottom: 8,
        minHeight: 40,
        maxHeight: 40,
    },
    categoryChip: {
        justifyContent: "center", 
        alignItems: "center",
        paddingHorizontal: 14,
        height: 36, 
        marginRight: 8,
    },
    categoryChipActive: { borderBottomWidth: 3, borderColor: "#73C04D" },
    categoryText: { color: "#333", fontSize: 14 },
    categoryTextActive: { color: "#73C04D", fontWeight: "600", fontSize: 14 },

    subCategoryContainer: {
        marginBottom: 12,
        minHeight: 40,
        maxHeight: 40,
    },
    subChip: {
        backgroundColor: "#e3e3e3",
        justifyContent: "center", 
        alignItems: "center",
        paddingHorizontal: 14,
        height: 32,   
        marginRight: 12,
        borderRadius: 16,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        fontStyle: "italic",
    },
    subChipActive: { backgroundColor: "#73C04D" },
    subText: { color: "#333", fontSize: 13 },
    subTextActive: { color: "#fff", fontSize: 13, fontWeight: "600" },

    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        margin: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: { backgroundColor: "#E0E0E0", width: "100%", height: 120, borderRadius: 8, marginBottom: 8, resizeMode: "contain" },
    cardTitle: { fontSize: 14, fontWeight: "bold" },
    cardDescription: { fontSize: 12, color: "#666", marginVertical: 4 },
    cardPrice: { fontSize: 13, fontWeight: "600", color: "#76b13a" },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 16,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: "100%",
    },
    closeBtn: { alignItems: "left", marginBottom: 3 },
    modalImage: { backgroundColor: "#E0E0E0", width: "90%", height: 180, borderRadius: 12, marginBottom: 12, resizeMode: "contain" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    modalPrice: { fontSize: 16, fontWeight: "600", color: "#76b13a" },
    modalDescription: { fontSize: 14, color: "#555", marginVertical: 8 },

    quantityBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 2,
        marginVertical: 10,
        width: 120,
    },
    qtyBtn: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    qtyValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    priceText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 16,
        textAlign: "center",
        color: "#333",
    },
    productName: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center",
    },
    sizeSelector: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 12,
    },
    sizeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 26,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: "#fff",

        // ios
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        
        // android
        elevation: 4,
    },
    sizeBtnActive: {
        backgroundColor: "#76B13A",
        borderColor: "#76B13A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    sectionTitle: { fontSize: 14, fontWeight: "600", marginTop: 10, paddingBottom: 4, borderBottomWidth: 3, borderColor: "#73C04D" },
    sizeContainer: { flexDirection: "row", marginVertical: 8 },
    sizeOption: {
        borderWidth: 1,
        borderBottomWidth: 3, 
        borderColor: "#73C04D",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginRight: 8,
    },
    sizeSelected: { backgroundColor: "#73C04D", borderColor: "#73C04D" },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        fontSize: 14,
        color: "#000",
        minHeight: 80,
    },
    addBtn: {
        flex: 1,
        backgroundColor: "#ddfac0",
        borderWidth: 1,
        borderColor: "#76B13A",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 12,
    },
    orderBtn: {
        flex: 1,
        backgroundColor: "#76B13A",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 12,
    },

    validityModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    validityModalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "75%",
        alignItems: "center",
    },
    validityModalBtn: {
        marginTop: 16,
        backgroundColor: "#76B13A",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },

    bottomTabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 8,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 30,
        paddingVertical: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 6,
    },
    tabItem: { alignItems: "center" },
    tabText: { fontSize: 12, marginTop: 2 },
});