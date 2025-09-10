import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../constants/Styles";

type ButtonProps = {
  action: () => void;
  titre: string;
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZES.paddingMedium,
    paddingHorizontal: SIZES.paddingLarge,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
  },
});

const Button: React.FC<ButtonProps> = ({ action, titre }) => {
  return (
    <TouchableOpacity onPress={action} style={styles.button}>
      <Text style={styles.text}>{titre}</Text>
    </TouchableOpacity>
  );
};

export default Button;
