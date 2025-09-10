import React from "react";
import { View } from "react-native";

type SpaceBottomProps = {
  size: number;
};

const SpaceBottom: React.FC<SpaceBottomProps> = ({ size }) => {
  return <View style={{ marginBottom: size }} />;
};

export default SpaceBottom;
