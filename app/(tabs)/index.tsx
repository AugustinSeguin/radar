import MapComponent from "@/components/MapComponent";
import * as Location from "expo-location";
import { useEffect } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "La permission de localisation est requise pour afficher la carte."
        );
      }
    })();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapComponent />
    </SafeAreaView>
  );
}
