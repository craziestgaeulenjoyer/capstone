import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetToLanding } from "../navigationRef";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SessionExpiredModal({ visible, onClose }: Props) {
  const handleOk = async () => {
    await AsyncStorage.removeItem("token");
    onClose();

    const handleOk = async () => {
      await AsyncStorage.removeItem("token");
      onClose();
      resetToLanding();
    };
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Session expired</Text>
          <Text style={styles.text}>
            Please log in again to continue.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleOk}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#73C04D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
