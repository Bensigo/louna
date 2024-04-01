import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomImage from "../CustomImage";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const FullScreenImage = ({ visible, imageUrl, onClose }: {visible: boolean, imageUrl: string, onClose: () => void }) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.overlay}></TouchableOpacity>
        <View style={styles.imageContainer}>
          <CustomImage resizeMode="contain" alt={'fullimage'} src={imageUrl} height={screenHeight} width={screenWidth} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.9,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 40,
  },
});

export default FullScreenImage;
