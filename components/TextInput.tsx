import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants/Styles";

type InputProps = {
  value: string;
  placeholder: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address";
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
    marginVertical: SIZES.paddingSmall,
    backgroundColor: COLORS.white,
    color: COLORS.black,
    fontSize: SIZES.fontMedium,
    width: 220,
  },
});

const CustomTextInput: React.FC<InputProps> = ({
  value,
  placeholder,
  editable = true,
  onChangeText,
  keyboardType = "default",
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      editable={editable}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

export default CustomTextInput;
