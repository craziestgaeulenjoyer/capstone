import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from "../components/Header";
import { products } from "../data/products";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    gender: "",
    birthday: "",
    phone_number: "",
  });

  const [profileImage, setProfileImage] = useState<any>(require("../../assets/default-profile-icon.png"));
  const [view, setView] = useState<"main" | "viewProfile" | "editProfile" | "favorites">("main");
  const [viewExpanded, setViewExpanded] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [description, setDescription] = useState("");

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch("http://10.0.2.2:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Non-JSON response:", text);
        return;
      }

      if (response.ok) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          gender: data.gender || "",
          birthday: data.birthday || "",
          phone_number: data.phone_number || "",
        });
      } else {
        console.log("Error fetching profile:", data.message || text);
      }
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://10.0.2.2:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
        Alert.alert("Success", "Profile updated successfully");
        setView("main");
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const handleImagePick = () => {
    const options: any = { mediaType: "photo", quality: 0.8 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage)
        console.log("ImagePicker Error:", response.errorMessage);
      else if (response.assets?.length) {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Landing" as never);
    } catch (err) {
      console.log("Error logging out:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Profile" />

      {/* Main View */}
      {view === "main" && (
        <ScrollView style={{ flex: 1 }}>
          {/* Profile Info */}
          <View style={styles.profileCard}>
            <Image source={profileImage} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {profile?.full_name || "Loading..."}
              </Text>
              <Text style={styles.userEmail}>{profile?.email || ""}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={async () => {
                const stored = await AsyncStorage.getItem("favorites");
                if (stored) {
                  const favoriteIds = JSON.parse(stored);
                  const favoriteProducts = products.filter((p) =>
                    favoriteIds.includes(p.id)
                  );
                  setFavorites(favoriteProducts);
                  setView("favorites");
                }
              }}
            >
              <Icon name="heart-outline" size={22} color="#73C04D" />
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Icon name="time-outline" size={22} color="#73C04D" />
              <Text style={styles.actionText}>Past Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Icon name="settings-outline" size={22} color="#73C04D" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Other Features */}
          <View style={styles.otherContainer}>
            <Text style={styles.sectionTitle}>Other Features</Text>

            {/* Collapsible View Profile */}
            <TouchableOpacity
              style={styles.otherItem}
              onPress={() => setViewExpanded(!viewExpanded)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="person-outline" size={18} color="#73C04D" style={{ marginRight: 8 }} />
                <Text style={styles.otherText}>Personal Information</Text>
              </View>
              <Icon
                name={viewExpanded ? "chevron-up" : "chevron-forward"}
                size={18}
                color="#ccc"
              />
            </TouchableOpacity>

            {/* Expanded Profile Info */}
            {viewExpanded && (
            <View style={styles.expandedSection}>
              <View style={styles.expandedHeader}>
                <Text style={styles.expandedTitle}>Personal Information</Text>
                <TouchableOpacity onPress={() => setView("editProfile")}>
                  <Text style={styles.editInline}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Image source={profileImage} style={styles.avatarSmall} />
              </View>

              {[
                { label: "Full Name", value: profile?.full_name },
                { label: "Email", value: profile?.email },
                { label: "Phone Number", value: profile?.phone_number },
                { label: "Birthday", value: profile?.birthday },
                { label: "Gender", value: profile?.gender },
              ].map((item, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text style={styles.fieldLabel}>{item.label}</Text>
                  {item.value ? (
                    <Text style={styles.profileField}>{item.value}</Text>
                  ) : (
                    <Text style={styles.emptyField}>
                      <Text style={{ fontStyle: "italic" }}>
                        No {item.label.toLowerCase()} saved.
                      </Text>
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

            {/* Other existing items */}
            {[
              "Frequently asked questions",
              "Share your feedback",
              "Terms of use",
              "Privacy policy",
              "Logout",
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.otherItem}
                onPress={() => {
                  if (item === "Logout") handleLogout();
                  else if (item === "Share your feedback") setShowFeedbackModal(true);
                }}
              >
                <Text style={styles.otherText}>{item}</Text>
                <Icon name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* View Profile Page */}
      {view === "viewProfile" && (
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <TouchableOpacity onPress={() => setView("main")}>
            <Icon name="arrow-back" size={24} color="#73C04D" />
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Image source={profileImage} style={styles.avatarLarge} />
            <Text style={styles.userName}>{profile?.full_name}</Text>
            <Text style={styles.userEmail}>{profile?.email}</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            {[
              { label: "Gender", value: profile?.gender },
              { label: "Birthday", value: profile?.birthday },
              { label: "Phone Number", value: profile?.phone_number },
            ].map((item, i) => (
              <View key={i} style={{ marginBottom: 15 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>{item.label}</Text>
                </View>
                <Text style={styles.profileValue}>{item.value || "N/A"}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.saveBtn, { alignSelf: "center" }]}
            onPress={() => setView("editProfile")}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Edit Profile Page */}
      {view === "editProfile" && (
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Back */}
        <TouchableOpacity onPress={() => setView("main")}>
          <Icon name="arrow-back" size={24} color="#73C04D" />
        </TouchableOpacity>

        <Text style={[styles.profileTitle, { marginBottom: 10 }]}>
          Edit Profile
        </Text>

        {/* Profile Picture */}
        <TouchableOpacity
          onPress={handleImagePick}
          style={{ alignSelf: "center", marginBottom: 15 }}
        >
          <Image source={profileImage} style={styles.avatarLarge} />
          <Text style={{ color: "#73C04D", fontSize: 13, textAlign: "center" }}>
            Change Photo
          </Text>
        </TouchableOpacity>

        {/* Full Name */}
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={formData.full_name}
          onChangeText={(text) => setFormData({ ...formData, full_name: text })}
        />

        {/* Email */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        {/* Gender */}
        <Text style={styles.inputLabel}>Gender</Text>
        <TouchableOpacity
          onPress={() => setShowGenderModal(true)}
          style={[styles.input, { justifyContent: "center" }]}
        >
          <Text style={{ color: formData.gender ? "#000" : "#999" }}>
            {formData.gender || "Select Gender"}
          </Text>
        </TouchableOpacity>

        {/* Gender Modal */}
        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { width: "85%" }]}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {["Male", "Female", "Other"].map((g, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.modalOption}
                  onPress={() => {
                    setFormData({ ...formData, gender: g });
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{g}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.button, styles.cancelBtn]}
                onPress={() => setShowGenderModal(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Birthday */}
        <Text style={styles.inputLabel}>Birthday</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, { justifyContent: "center" }]}
        >
          <Text style={{ color: formData.birthday ? "#000" : "#999" }}>
            {formData.birthday || "Select Birthday"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          maximumDate={new Date()}
          onConfirm={(date) => {
            const formatted = date.toISOString().split("T")[0];
            setFormData({ ...formData, birthday: formatted });
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* Phone Number */}
        <Text style={styles.inputLabel}>Phone Number</Text>
        <View style={styles.phoneWrapper}>
          <Text style={styles.phonePrefix}>+63</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter Phone Number"
            keyboardType="number-pad"
            maxLength={10}
            value={formData.phone_number}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                phone_number: text.replace(/[^0-9]/g, ""),
              })
            }
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.button, styles.saveBtn, { alignSelf: "center" }]}
          onPress={handleSave}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    )}

    {view === "favorites" && (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <TouchableOpacity onPress={() => setView("main")} style={{ marginBottom: 10 }}>
          <Icon name="arrow-back" size={24} color="#73C04D" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
          Your Favorites
        </Text>

        {favorites.length > 0 ? (
          favorites.map((item) => (
            <View key={item.id} style={styles.favoriteCard}>
              <Image source={item.image} style={styles.favoriteImage} />
              <Text style={styles.favoriteTitle}>{item.name}</Text>
              <Text style={styles.favoriteDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.favoritePrice}>
                ₱{item.priceSmall}/{item.priceMedium}/{item.priceLarge}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#999" }}>
            No favorite items yet.
          </Text>
        )}
      </ScrollView>
    )}

    {/* Feedback Modal */}
    <Modal
      visible={showFeedbackModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFeedbackModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { width: "85%" }]}>
          <Text style={styles.modalTitle}>Share Your Feedback</Text>
          <TouchableOpacity
            onPress={() => setShowFeedbackModal(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => setRating(num)}>
                <Icon
                  name={num <= rating ? "star" : "star-outline"}
                  size={30}
                  color="#FFD700"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Tell us about your experience..."
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={[styles.button, styles.saveBtn, { alignSelf: "center", marginTop: 10 }]}
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem("token");
                const response = await fetch("http://10.0.2.2:5000/api/feedback", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ rating, description }),
                });
                const data = await response.json();
                if (response.ok) {
                  Alert.alert("Thank you!", "Your feedback has been submitted.");
                  setShowFeedbackModal(false);
                  setRating(0);
                  setDescription("");
                } else {
                  Alert.alert("Error", data.message || "Submission failed.");
                }
              } catch (err) {
                console.error("Error submitting feedback:", err);
              }
            }}
          >
            <Text style={styles.submitText}>Submit</Text>
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
                tab === "Profile"
                  ? "person"
                  : tab === "Nearby"
                  ? "location-outline"
                  : tab === "Menu"
                  ? "restaurant-outline"
                  : tab === "Home"
                  ? "home-outline"
                  : "cart-outline"
              }
              size={22}
              color={tab === "Profile" ? "#73C04D" : "#999"}
            />
            <Text
              style={[
                styles.tabText,
                { color: tab === "Profile" ? "#73C04D" : "#999" },
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  // Profile Card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  expandedSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
  },
  expandedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  editInline: {
    color: "#73C04D",
    fontWeight: "600",
  },
  profileField: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
    textAlign: "left",
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
    padding: 5,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#555",
    fontWeight: "bold",
  },
  avatarSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  avatar: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 16 
  },
  avatarLarge: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    marginBottom: 8 
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#73C04D",
    marginBottom: 2,
  },
  emptyField: {
    fontSize: 14,
    color: "#999",
    textAlign: "left",
  },

  favoriteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain",
    backgroundColor: "#f2f2f2",
  },
  favoriteTitle: { fontSize: 14, fontWeight: "bold" },
  favoriteDescription: { fontSize: 12, color: "#666", marginVertical: 4 },
  favoritePrice: { fontSize: 13, fontWeight: "600", color: "#76b13a" },

  userInfo: { 
    flex: 1 
  },
  userName: { 
    fontSize: 18, 
    fontWeight: "700" 
  },
  userEmail: { 
    color: "#666", 
    marginBottom: 6 
  },
  labelContainer: {
    backgroundColor: "#73C04D",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  labelText: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#73C04D",
    marginBottom: 4,
    marginLeft: 2,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  cancelBtn: {
    backgroundColor: "#eee",
    marginTop: 10,
  },
  btnText: {
    fontWeight: "600",
    color: "#333",
  },
  profileValue: {
    fontSize: 15,
    color: "#333",
    marginTop: 4,
    marginBottom: 8,
  },
  pickerWrapper: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#73C04D",
    marginLeft: 10,
    marginTop: 5,
  },
  picker: {
    width: "100%",
    height: 45,
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  phonePrefix: {
    fontWeight: "600",
    color: "#73C04D",
    fontSize: 15,
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    height: 45,
    fontSize: 14,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
  },
  saveBtn: { 
    backgroundColor: "#73C04D" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    paddingBottom: 10,
    marginBottom: 24,
  },
  actionItem: { 
    alignItems: "center" 
  },
  actionText: { 
    marginTop: 4, 
    fontSize: 12, 
    color: "#444" 
  },

  // Ratings
  ratingContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  ratingText: { 
    fontWeight: "600" 
  },
  ratingRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 4 
  },
  ratingNumber: { 
    fontWeight: "bold", 
    marginRight: 4 
  },

  // Other Features
  otherContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 10,
    color: "#444",
  },
  otherItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  otherText: { 
    color: "#333", 
    fontSize: 14 
  },

  // Bottom Tabs
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
