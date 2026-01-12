import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as VoiceToText from "@ascendtis/react-native-voice-to-text";

async function requestMicPermission() {
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
  }
  return true; // iOS automatically handles permission
}

const Header = ({ title, active = true }: { title: string; active?: boolean }) => {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  const startListening = async () => {
    if (isListening) return; 

    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert("Microphone permission denied.");
      return;
    }

    try {
      setIsListening(true);

      const result = await VoiceToText.startListening();
      setRecognizedText(result || "");
    } catch (e) {
      console.error("Voice error:", e);
    } finally {
      await stopListening(); 
    }
  };

  const stopListening = async () => {
    try {
      await VoiceToText.stopListening();
    } catch (e) {
      console.warn("Stop listening error:", e);
    } finally {
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      VoiceToText.stopListening().catch(() => {});
    };
  }, []);

  if (!active) return null;

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../../assets/MiAmore2.png")} style={styles.logo} />
        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowVoiceModal(true)}>
            <Icon name="mic-outline" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* VOICE MODAL */}
      <Modal
        visible={showVoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={async () => {
                await stopListening();
                setShowVoiceModal(false);
              }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.voiceTitle}>Voice Ordering</Text>
            <Text style={styles.voiceSubtitle}>
              Just speak your order, and we'll handle the rest.
            </Text>

            <TouchableOpacity
              disabled={isListening}
              style={[
                styles.micCircle,
                {
                  backgroundColor: isListening ? "#E57373" : "#76B13A",
                  opacity: isListening ? 0.7 : 1,
                },
              ]}
              onPress={startListening}
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
                onPress={() => setShowVoiceModal(false)}
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

export default Header;

/* ------------------------------- STYLES ------------------------------- */

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  headerIcons: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  /* Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  closeBtn: {
    alignSelf: "flex-end",
  },

  closeText: {
    fontSize: 30,
    fontWeight: "bold",
  },

  voiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  voiceSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  micCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  tapSpeakText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },

  voiceResultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  voiceResultText: {
    fontSize: 16,
    textAlign: "center",
    minHeight: 50,
    paddingHorizontal: 10,
    color: "#333",
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-between",
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  confirmBtn: {
    backgroundColor: "#76B13A",
  },

  retryBtn: {
    backgroundColor: "#E57373",
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
