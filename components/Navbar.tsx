import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";

type NavbarProps = {
  activeTab?: "scan" | "stock" | "buy";
};

const Navbar: React.FC<NavbarProps> = ({ activeTab = "scan" }) => {
  const router = useRouter();

  const changeRoute = (route: "scan" | "stock" | "buy") => {
    if (route === "scan") router.push("/scan" as any);
    else if (route === "stock") router.push("/stock" as any);
    else if (route === "buy") router.push("/buy" as any);
  };

  return (
    <SafeAreaView style={styles.footer}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => changeRoute("scan")}
        >
          <MaterialIcons
            name="qr-code-scanner"
            size={SIZES.icon}
            color={activeTab === "scan" ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={styles.label}>Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => changeRoute("stock")}
        >
          <MaterialIcons
            name="inventory-2"
            size={SIZES.icon}
            color={
              activeTab === "stock" ? COLORS.primary : COLORS.textSecondary
            }
          />
          <Text
            style={[styles.label, activeTab === "stock" && styles.activeLabel]}
          >
            Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => changeRoute("buy")}
        >
          <MaterialIcons
            name="shopping-cart"
            size={SIZES.icon}
            color={activeTab === "buy" ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={styles.label}>À Acheter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary + "CC",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.paddingSmall,
    paddingBottom: SIZES.paddingXS,
    paddingHorizontal: SIZES.paddingLarge,
    zIndex: 10,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center", // Center items vertically
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontXS,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

export default Navbar;
