import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { MapViewProps, Marker } from "react-native-maps";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

type Props = {
  userLocation?: UserLocation;
} & Partial<MapViewProps>;

export default function MapComponent({ userLocation, ...rest }: Props) {
  const zoomedRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : undefined;

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(zoomedRegion, 500);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={zoomedRegion}
        showsUserLocation={!!userLocation}
        followsUserLocation={!!userLocation}
        {...rest}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Ma position"
          />
        )}
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
});
