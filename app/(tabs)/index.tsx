import MapComponent from "@/components/MapComponent";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserLocation = { latitude: number; longitude: number } | null;

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const mounted = useRef(true);

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert(
        "Impossible d'ouvrir les réglages",
        "Ouvrez manuellement les paramètres et activez la localisation."
      );
    });
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "La permission de localisation est requise pour afficher la carte."
        );
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Service de localisation désactivé",
          "Le service de localisation est désactivé sur cet appareil. Activez-le pour permettre à l'application d'obtenir votre position.",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Ouvrir les réglages", onPress: openSettings },
            { text: "Réessayer", onPress: () => getLocation() },
          ]
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      if (!mounted.current) return;
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      console.warn("Erreur en récupérant la position :", err);
      Alert.alert(
        "Erreur de localisation",
        "Impossible de récupérer la position. Vérifiez que le service de localisation est activé et que l'application a la permission.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Réessayer", onPress: () => getLocation() },
        ]
      );
    }
  };

  useEffect(() => {
    mounted.current = true;
    getLocation();
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapComponent userLocation={userLocation} />
    </SafeAreaView>
  );
}
