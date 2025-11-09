import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Image,
  PermissionsAndroid,
  Platform,
  NativeModules
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; 
import Voice from "@react-native-voice/voice";

console.log("Voice object:", Voice);
console.log("NativeModules.RNVoice:", NativeModules.RNVoice);

async function requestMicPermission() {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "App needs access to your microphone for voice ordering.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true; // iOS handles automatically
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const Header = ({ title, active = true }: { title: string; active?: boolean }) => {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // ✅ Safely attach event listeners
  useEffect(() => {
    if (!active) return; // Don't initialize if header is hidden
    if (!Voice) {
      console.warn("Voice module not initialized yet.");
      return;
    }

    console.log("Initializing voice listeners...");
    try {
      Voice.onSpeechStart = () => {
        console.log("Voice recognition started...");
        setIsListening(true);
      };

      Voice.onSpeechEnd = () => {
        console.log("Voice recognition ended.");
        setIsListening(false);
      };

      Voice.onSpeechResults = (event) => {
        const text = event.value?.[0] ?? "";
        setRecognizedText(text);
        console.log("Recognized:", text);
      };

      Voice.onSpeechError = (error) => {
        console.error("Speech error:", error);
        setIsListening(false);
      };
    } catch (e) {
      console.error("Voice listener setup failed:", e);
    }

    // Cleanup
    return () => {
      console.log("Cleaning up voice listeners...");
      try {
        Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
      } catch (err) {
        console.warn("Voice cleanup error:", err);
      }
    };
  }, [active]);

  const startListening = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      alert("Microphone permission denied. Please enable it in settings.");
      return;
    }

    try {
      console.log("Starting voice recognition...");
      setRecognizedText("");
      if (Voice) await Voice.start("en-US");
      else console.warn("Voice instance not ready.");
    } catch (e) {
      console.error("Voice start error:", e);
    }
  };

  const stopListening = async () => {
    try {
      console.log("Stopping voice recognition...");
      if (Voice) await Voice.stop();
    } catch (e) {
      console.error("Voice stop error:", e);
    }
  };

  if (!active) return null; // ✅ Avoid rendering when not active (e.g., during Checkout)

  return (
    <>
      {/* Header bar */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/MiAmore2.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowVoiceModal(true)}>
            <Icon name="mic-outline" size={24} color="#000" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Ordering Modal */}
      <Modal
        visible={showVoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setShowVoiceModal(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.voiceTitle}>Voice Ordering</Text>
            <Text style={styles.voiceSubtitle}>
              Just speak your order, and we'll handle the rest.
            </Text>

            <TouchableOpacity
              style={[
                styles.micCircle,
                { backgroundColor: isListening ? "#E57373" : "#76B13A" },
              ]}
              onPress={isListening ? stopListening : startListening}
            >
              <Icon name="mic" size={90} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.tapSpeakText}>
              {isListening ? "Listening..." : "Tap & Speak"}
            </Text>

            <Text style={styles.voiceResultTitle}>You said:</Text>
            <Text style={styles.voiceResultText}>
              {recognizedText || "— waiting for input —"}
            </Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.confirmBtn]}
                onPress={() => {
                  console.log("Add to cart:", recognizedText);
                  setShowVoiceModal(false);
                }}
              >
                <Text style={styles.btnText}>Confirm Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.retryBtn]}
                onPress={() => setRecognizedText("")}
              >
                <Text style={styles.btnText}>Try again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24, 
    fontWeight: "bold", 
    fontFamily: 'Montserrat-Bold', 
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    left: 15,
  },
  closeText: {
    fontSize: 28,
    color: "#444",
  },
  voiceTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
  },
  voiceSubtitle: {
    color: "#666",
    marginBottom: 25,
    marginTop: 8,
    textAlign: "center",
  },
  micCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#76B13A",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  tapSpeakText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  voiceResultTitle: {
    fontWeight: "600",
    marginTop: 5,
  },
  voiceResultText: {
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmBtn: {
    backgroundColor: "#76B13A",
  },
  retryBtn: {
    backgroundColor: "#C7E5A1",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Header;

function alert(arg0: string) {
  throw new Error("Function not implemented.");
}

