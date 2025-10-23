import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { Circle, MapViewProps, Marker } from "react-native-maps";

const RADARS_URL =
  "https://www.data.gouv.fr/fr/datasets/r/402aa4fe-86a9-4dcd-af88-23753e290a58";

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

type ExtendedProps = Props & {
  typeFilter?: string;
  maxDistanceKm?: number | null;
};

async function fetchAndParseRadars(): Promise<RadarData[]> {
  try {
    const response = await fetch(RADARS_URL);
    const csvText = await response.text();

    const lines = csvText.trim().split("\n");
    if (lines.length === 0) return [];

    const header = lines[0].split(";").map((h) => h.trim().replaceAll('"', ""));

    const latIndex = header.indexOf("Latitude");
    const lonIndex = header.indexOf("Longitude");
    const idIndex = header.indexOf("Identifiant unique");
    const typeIndex = header.indexOf("Type de radar");
    const vmaIndex = header.indexOf("VMA (km/h)");

    if (latIndex === -1 || lonIndex === -1) {
      throw new Error("Colonnes Latitude ou Longitude introuvables.");
    }

    const radars: RadarData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(";");

      const latitude = Number.parseFloat(parts[latIndex]);
      const longitude = Number.parseFloat(parts[lonIndex]);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

      radars.push({
        id: parts[idIndex] || `radar-${i}`,
        type: parts[typeIndex] || "Inconnu",
        vma: parts[vmaIndex] || "N/A",
        latitude,
        longitude,
      });
    }

    return radars;
  } catch (error) {
    console.error("Erreur de chargement des radars :", error);
    Alert.alert(
      "Erreur de données",
      "Impossible de charger la liste des radars."
    );
    return [];
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapComponent({
  userLocation,
  typeFilter,
  maxDistanceKm,
  ...rest
}: ExtendedProps) {
  const [radarMarkers, setRadarMarkers] = useState<RadarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLatitudeDelta, setMapLatitudeDelta] = useState<number | null>(null);
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetchAndParseRadars().then((data) => {
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

  const filteredRadars = radarMarkers.filter((r) => {
    if (typeFilter && typeFilter.trim().length > 0) {
      const needle = typeFilter.trim().toLowerCase();
      if (!String(r.type).toLowerCase().includes(needle)) return false;
    }

    if (maxDistanceKm != null && userLocation) {
      const d = haversineKm(
        userLocation.latitude,
        userLocation.longitude,
        r.latitude,
        r.longitude
      );
      if (d > maxDistanceKm) return false;
    }

    return true;
  });

  const CLUSTER_RADIUS_KM = 10;
  const CLUSTER_MIN_COUNT = 6; 
  const MAX_CLUSTERS = 3;

  type Cluster = { lat: number; lon: number; count: number; ids: string[] };

  function computeClusters(points: RadarData[]): Cluster[] {
    const used = new Set<string>();
    const clusters: Cluster[] = [];

    for (const p of points) {
      if (used.has(p.id)) continue;
      const neighbors = points.filter((q) => {
        const d = haversineKm(p.latitude, p.longitude, q.latitude, q.longitude);
        return d <= CLUSTER_RADIUS_KM;
      });

      if (neighbors.length >= CLUSTER_MIN_COUNT) {
        const lat =
          neighbors.reduce((s, n) => s + n.latitude, 0) / neighbors.length;
        const lon =
          neighbors.reduce((s, n) => s + n.longitude, 0) / neighbors.length;
        const ids = neighbors.map((n) => n.id);
        for (const id of ids) used.add(id);
        clusters.push({ lat, lon, count: neighbors.length, ids });
      }
    }

    clusters.sort((a, b) => b.count - a.count);
    return clusters.slice(0, MAX_CLUSTERS);
  }

  let visibleRadars = filteredRadars;
  if (mapRegion) {
    const latMin = mapRegion.latitude - mapRegion.latitudeDelta / 2;
    const latMax = mapRegion.latitude + mapRegion.latitudeDelta / 2;
    const lonMin = mapRegion.longitude - mapRegion.longitudeDelta / 2;
    const lonMax = mapRegion.longitude + mapRegion.longitudeDelta / 2;
    visibleRadars = filteredRadars.filter(
      (r) =>
        r.latitude >= latMin &&
        r.latitude <= latMax &&
        r.longitude >= lonMin &&
        r.longitude <= lonMax
    );
  }

  const clustersToShow = computeClusters(visibleRadars);

  const ZOOM_THRESHOLD = 1.8;
  const showRadars =
    mapLatitudeDelta == null ? true : mapLatitudeDelta <= ZOOM_THRESHOLD;

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
        initialRegion={
          zoomedRegion || {
            latitude: 46.603354,
            longitude: 1.888334,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }
        }
        showsUserLocation={!!userLocation}
        followsUserLocation={false}
        onRegionChangeComplete={(region) => {
          if (region && typeof region.latitudeDelta === "number") {
            setMapLatitudeDelta(region.latitudeDelta);
            setMapRegion({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta ?? region.longitudeDelta,
            });
          }
        }}
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
        {showRadars
          ? filteredRadars.map((radar) => (
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
            ))
          : null}
        {/* Clusters: up to 3 circles showing high-density zones */}
        {clustersToShow.map((c) => (
          <Circle
            key={`cluster-${c.lat.toFixed(5)}-${c.lon.toFixed(5)}`}
            center={{ latitude: c.lat, longitude: c.lon }}
            radius={CLUSTER_RADIUS_KM * 1000} // meters
            strokeColor="rgba(255,165,0,0.6)"
            fillColor="rgba(255,165,0,0.12)"
          />
        ))}

        {/* Small marker at cluster center showing count to help visibility/debug */}
        {clustersToShow.map((c) => (
          <Marker
            key={`cluster-marker-${c.lat.toFixed(5)}-${c.lon.toFixed(5)}`}
            coordinate={{ latitude: c.lat, longitude: c.lon }}
            title={`${c.count} radars`}
            pinColor="orange"
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
  },
});
