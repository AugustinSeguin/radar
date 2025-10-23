import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { MapViewProps, Marker } from "react-native-maps";

const RADARS_URL = 'https://www.data.gouv.fr/fr/datasets/r/402aa4fe-86a9-4dcd-af88-23753e290a58';

type RadarData = {
  id: string;
  type: string;
  vma: string;
  latitude: number;
  longitude: number;
};

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

type Props = {
  userLocation?: UserLocation;
} & Partial<MapViewProps>;


async function fetchAndParseRadars(): Promise<RadarData[]> {
  try {
    const response = await fetch(RADARS_URL);
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    
    const header = lines[0].split(';').map(h => h.trim().replaceAll('"', ''));
    
    const latIndex = header.indexOf('Latitude');
    const lonIndex = header.indexOf('Longitude');
    const idIndex = header.indexOf('Identifiant unique');
    const typeIndex = header.indexOf('Type de radar');
    const vmaIndex = header.indexOf('VMA (km/h)');

    if (latIndex === -1 || lonIndex === -1) {
      throw new Error("Colonnes Latitude ou Longitude introuvables.");
    }

    const radars: RadarData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(';');
      
      const latitude = Number.parseFloat(parts[latIndex]);
      const longitude = Number.parseFloat(parts[lonIndex]);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

      radars.push({
        id: parts[idIndex] || `radar-${i}`,
        type: parts[typeIndex] || 'Inconnu',
        vma: parts[vmaIndex] || 'N/A',
        latitude,
        longitude,
      });
    }

    return radars;

  } catch (error) {
    console.error("Erreur de chargement des radars :", error);
    Alert.alert("Erreur de données", "Impossible de charger la liste des radars.");
    return [];
  }
}

export default function MapComponent({ userLocation, ...rest }: Props) {
  const [radarMarkers, setRadarMarkers] = useState<RadarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetchAndParseRadars().then(data => {
      setRadarMarkers(data);
      setIsLoading(false);
    });
  }, []);


  const zoomedRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : undefined;

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(zoomedRegion, 500);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={zoomedRegion || { 
          latitude: 46.603354,
          longitude: 1.888334,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        showsUserLocation={!!userLocation}
        followsUserLocation={false} 
        {...rest}
      >
        {/* Marqueur de la position de l'utilisateur */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Ma position"
            pinColor="green" 
          />
        )}

        {/* Marqueurs des radars */}
        {radarMarkers.map((radar) => (
          <Marker
            key={radar.id}
            coordinate={{
              latitude: radar.latitude,
              longitude: radar.longitude,
            }}
            title={`Radar ${radar.type}`}
            description={`Vitesse max : ${radar.vma} km/h`}
            pinColor="red" 
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  }
});