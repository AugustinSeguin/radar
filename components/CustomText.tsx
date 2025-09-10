import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/Styles";

type TextProps = {
  text: string;
  styles?: StyleProp<TextStyle>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.main,
    color: COLORS.black,
    fontSize: SIZES.fontMedium,
    fontWeight: "normal",
  },
});

const CustomText: React.FC<TextProps> = ({ text, styles: customStyles }) => {
  return <Text style={customStyles ?? styles.text}>{text}</Text>;
};

export default CustomText;
