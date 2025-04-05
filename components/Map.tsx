import React, { useEffect, useMemo, useState } from "react";
import Mapbox, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserTrackingMode,
} from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@/environment";
import * as Location from "expo-location";
import { View, Text } from "react-native";
import { featureCollection, point } from "@turf/helpers";
import { propertyCoordinates } from "@/constants/data";
import locationPin from "@/assets/icons/home.png";
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
  const perchFeatures = useMemo(() => {
    return featureCollection(
      propertyCoordinates.map((coordinates) =>
        point([coordinates.long, coordinates.lat])
      )
    );
  }, []);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
        setLocationPermission(true);
      } catch (error) {
        setErrorMsg("Error requesting location permission");
        console.error("Location permission error:", error);
      }
    })();
  }, []);

  if (!locationPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{errorMsg || "Requesting location permission..."}</Text>
      </View>
    );
  }

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/streets-v12">
      <Camera
        followUserLocation
        followZoomLevel={16}
        followUserMode={UserTrackingMode.FollowWithCourse}
        animationDuration={1000}
      />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        pulsing={{ isEnabled: true }}
      />

      <ShapeSource id="properties" shape={perchFeatures}>
        <SymbolLayer
          id="property-symbols"
          style={{
            iconImage: "locationPin",
            iconSize: 0.5,
            iconAllowOverlap: true,
          }}
        />
        <Images
          images={{ locationPin: locationPin }}
          onImageMissing={(imageId) => {
            console.warn("Missing image: ", imageId);
          }}
        />
      </ShapeSource>
    </MapView>
  );
};

export default Map;
