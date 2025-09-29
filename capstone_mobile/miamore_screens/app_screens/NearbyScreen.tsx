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
  ImageBackground,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const MenuScreen: React.FC = () => {  
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../assets/MiAmore2.png')} style={styles.logo} />
                <Text style={styles.headerTitle}>Nearby</Text>
                <View style={styles.headerIcons}>
                    <Icon name="mic-outline" size={24} color="#000" style={styles.icon} />
                    <Icon name="notifications-outline" size={24} color="#000" />
                </View>
            </View>

            <View style={styles.bottomTabs}>
                {["Home", "Nearby", "Menu", "Cart", "Profile"].map((tab, i) => (
                    <TouchableOpacity
                    key={i}
                    style={styles.tabItem}
                    onPress={() => {
                        if (tab === "Menu") {
                        navigation.navigate("Menu"); 
                        } else if (tab === "Home") {
                        navigation.navigate("Home");
                        } else if (tab === "Nearby") {
                        navigation.navigate("Nearby"); 
                        } else if (tab === "Cart") {
                        navigation.navigate("Cart");   
                        } else if (tab === "Profile") {
                        navigation.navigate("Profile"); 
                        }
                    }}
                    >
                    <Icon
                        name={
                        tab === "Nearby"
                            ? "location"
                            : tab === "Home"
                            ? "home-outline"
                            : tab === "Menu"
                            ? "restaurant-outline"
                            : tab === "Cart"
                            ? "cart-outline"
                            : "person-outline"
                        }
                        size={22}
                        color={tab === "Nearby" ? "#73C04D" : "#999"}
                    />
                    <Text
                        style={[
                        styles.tabText,
                        { color: tab === "Nearby" ? "#73C04D" : "#999" },
                        ]}
                    >
                        {tab}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
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
    headerTitle: { fontSize: 24, fontWeight: "800" },
    headerIcons: { flexDirection: "row" },
    icon: { marginRight: 24 },

    bottomTabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
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