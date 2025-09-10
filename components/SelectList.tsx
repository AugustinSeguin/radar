import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, SIZES } from "../constants/Styles";

type SelectListProps = {
  list: string[];
  selectedValue: string;
  placeholder: string;
  onValueChange?: (value: string) => void;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.paddingSmall,
    marginVertical: SIZES.paddingSmall,
    backgroundColor: COLORS.white,
    width: 220,
  },
  picker: {
    height: 60,
    width: "100%",
  },
  item: {
    fontSize: SIZES.fontSmall,
  },
});

const SelectList: React.FC<SelectListProps> = ({
  list,
  selectedValue,
  placeholder,
  onValueChange = () => {},
}) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item
          label={placeholder}
          value=""
          enabled={false}
          style={styles.item}
        />
        {list.map((item) => (
          <Picker.Item
            key={item}
            label={item}
            value={item}
            style={styles.item}
          />
        ))}
      </Picker>
    </View>
  );
};

export default SelectList;
