import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

const UI_CATEGORIES = [
  "All",
  "Popular",
  "Coffees",
  "Milktea",
  "Lemonade and Fruitti Juice",
  "Premium Matcha",
  "Foods",
];

const subcategoriesMap: Record<string, string[]> = {
  popular: [
    "Coffee",
    "Milktea",
    "Premium Matcha",
    "Specialty Coffee",
    "Lemonade and Fruit Juices",
    "Snacks",
    "Platters",
    "Quesadillas and Korean Corndogs",
    "Croffles",
  ],
  coffees: ["Coffee", "Specialty Coffee"],
  milktea: ["Classic", "Special"],
  "lemonade and fruitti juice": ["Lemonade", "Fruit"],
  "premium matcha": [],
  foods: ["Snacks", "Platters", "Croffles", "Quesadillas & Korean Corndogs"],
};

const API_URL = "http://10.0.2.2:5000"; // Node backend
const LARAVEL_BASE = "http://10.0.2.2:8000"; // Laravel public base

const MenuScreen: React.FC = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [notes, setNotes] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const getImageSource = (uri: string | null) =>
    uri ? { uri } : require("../../assets/MiAmore2.png");

  const fetchMenuItems = async () => {
    setLoading(true);
    console.warn("Fetching menu items...");

    try {
      const res = await fetch(`${API_URL}/api/menu-items`);
      const data = await res.json();
      console.warn("Raw data fetched:", data);

      const transformed = (Array.isArray(data) ? data : []).map((item: any) => {
        const imageUri = item.image_path
          ? `${LARAVEL_BASE}/storage/${item.image_path.replace(/^\/+/, "")}`
          : null;

        const dbCats: string[] = Array.isArray(item.categories)
          ? item.categories.map((c: string) => String(c).trim())
          : [];
        const dbSubs: string[] = Array.isArray(item.subcategories)
          ? item.subcategories.map((s: string) => String(s).trim())
          : [];

        // Map all matching UI categories
        const uiCategories: string[] = UI_CATEGORIES.filter(
          (cat) =>
            dbCats.some((c) => c.toLowerCase() === cat.toLowerCase()) ||
            dbSubs.some((s) => s.toLowerCase().startsWith(cat.toLowerCase()))
        );

        // If no match, use first DB category
        if (uiCategories.length === 0 && dbCats.length > 0) uiCategories.push(dbCats[0]);

        // Clean subcategories for UI filtering (remove prefixes like "Popular:Milktea")
        const uiSubcategories = dbSubs.map((s) => {
          const parts = s.split(":");
          return parts.length > 1 ? parts[1] : parts[0];
        });

        // Handle price
        const priceObj = item.price && typeof item.price === "object" ? item.price : {};
        const prices: Record<string, number> = {};
        Object.keys(priceObj).forEach((k) => {
          const v = priceObj[k];
          prices[String(k)] = typeof v === "string" ? Number(v) : v;
        });
        const sizeKeys = Object.keys(prices);
        const defaultSize = sizeKeys.length > 0 ? sizeKeys[0] : "";

        return {
          id: String(item.id),
          name: item.name,
          description: item.description || "",
          imageUri,
          image_path: item.image_path || null,
          prices,
          sizeKeys,
          defaultSize,
          categories: uiCategories, // <-- now array
          subcategories: uiSubcategories,
          raw: item,
        };
      });

      console.warn("Transformed products:", transformed);
      setProducts(transformed);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (p.categories && p.categories.includes(selectedCategory));

    const matchesSub = !selectedSub || p.subcategories.includes(selectedSub);
    const lowerQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !lowerQuery ||
      p.name.toLowerCase().includes(lowerQuery) ||
      p.categories.some((c: string) => c.toLowerCase().includes(lowerQuery)) ||
      p.subcategories.some((s: string) => s.toLowerCase().includes(lowerQuery)) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery));

    return matchesCategory && matchesSub && matchesSearch;
  });

  const availableSubcategories = React.useMemo(() => {
    if (selectedCategory === "All") return [];

    const key = selectedCategory.toLowerCase();
    return subcategoriesMap[key] || [];
  }, [selectedCategory]);


  useEffect(() => {
    console.log("Selected category:", selectedCategory);
    console.log("Selected subcategory:", selectedSub);
    console.log(
      "Filtered products:",
      filteredProducts.map((p) => ({  
        id: p.id,
        name: p.name,
        category: p.category,
        subcategories: p.subcategories,
      }))
    );
  }, [selectedCategory, selectedSub, filteredProducts]);

  const toggleFavorite = async (productId: string) => {
    let updated;
    if (favorites.includes(productId)) {
      updated = favorites.filter((id) => id !== productId);
    } else {
      updated = [...favorites, productId];
    }
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedSize(product.defaultSize || product.sizeKeys[0] || "");
    setNotes("");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
  };

  const getPriceLabel = (prod: any) => {
    if (!prod || !prod.sizeKeys || prod.sizeKeys.length === 0) return "₱0.00";
    const keys = prod.sizeKeys;
    if (keys.length === 1) return `₱${Number(prod.prices[keys[0]]).toFixed(2)}`;
    const first = Number(prod.prices[keys[0]]).toFixed(2);
    const second = Number(prod.prices[keys[1]]).toFixed(2);
    return `₱${first} / ₱${second}`;
  };

  const addToCart = async () => {
    if (!selectedProduct) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        size: selectedSize,
        quantity,
        instructions: notes,
        price: Number(selectedProduct.prices[selectedSize]),
        image: selectedProduct.imageUri || null,
      };
      console.log("Adding to cart payload:", payload);

      const res = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      if (res.ok) {
        setModalMessage("Added to cart!");
        setModalVisible(true);
        closeModal();
      } else {
        setModalMessage(data?.message || raw || "Error adding to cart");
        setModalVisible(true);
      }
    } catch (err: any) {
      console.error("Add to cart error:", err);
      setModalMessage(err?.message || "Something went wrong");
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Menu" />
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {UI_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
            onPress={() => {
              setSelectedCategory(cat);
              setSelectedSub(null);
            }}
          >
            <Text style={selectedCategory === cat ? styles.categoryTextActive : styles.categoryText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {availableSubcategories.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subCategoryContainer}>
          {availableSubcategories.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[styles.subChip, selectedSub === sub && styles.subChipActive]}
              onPress={() => setSelectedSub(sub)}
            >
              <Text style={selectedSub === sub ? styles.subTextActive : styles.subText}>{sub}</Text>
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
              <View style={{ position: "relative", flex: 1 }}>
                <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                  <Image source={getImageSource(item.imageUri)} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.cardPrice}>{getPriceLabel(item)}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteIcon}>
                  <Icon
                    name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                    size={22}
                    color={favorites.includes(item.id) ? "#ff4d4d" : "#fff"}
                    style={{ textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 3 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? `No products found for "${searchQuery}".` : "No products for this category."}
            </Text>
          </View>
        )}
      </View>

      {/* Modal for product details */}
      <Modal visible={!!selectedProduct} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Icon name="close" size={24} color="#76B13A" />
            </TouchableOpacity>
            {selectedProduct && (
              <>
                <View style={{ alignItems: "center" }}>
                  <Image source={getImageSource(selectedProduct.imageUri)} style={styles.modalImage} />
                </View>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>{getPriceLabel(selectedProduct)}</Text>
                <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
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
                <Text style={styles.sectionTitle}>Select options</Text>
                <View style={styles.sizeSelector}>
                  {selectedProduct.sizeKeys.map((s: string) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                      onPress={() => setSelectedSize(s)}
                    >
                      <Text style={{ color: selectedSize === s ? "#fff" : "#000" }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.sectionTitle}>What's included</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add special instructions..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={setNotes}
                  value={notes}
                />
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.addBtn} onPress={addToCart}>
                    <Text style={{ color: "#76B13A", fontSize: 16, fontWeight: "700" }}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add cart success/error modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.validityModalOverlay}>
          <View style={styles.validityModalBox}>
            <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>{modalMessage}</Text>
            <TouchableOpacity style={styles.validityModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Tabs */}
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
            <Text style={[styles.tabText, { color: tab === "Menu" ? "#73C04D" : "#999" }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat-Bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 24,
  },

  headerText: {
    marginLeft: 22,
    fontSize: 13,
    fontWeight: "400",
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
    fontFamily: "Montserrat",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#000", fontFamily: "Montserrat" },

  categoryContainer: {
    marginLeft: 12,
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
    marginLeft: 12,
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
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#fff",
    zIndex: 10,
  },

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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 3,
    borderColor: "#73C04D",
  },
  sizeContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  sizeOption: {
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: "#73C04D",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  sizeSelected: {
    backgroundColor: "#73C04D",
    borderColor: "#73C04D",
  },
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
