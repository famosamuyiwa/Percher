import React, { useEffect, useMemo, useState } from "react";
import Mapbox, {
  Camera,
  CircleLayer,
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
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Create a feature collection for the property coordinates
  const perchFeatures = useMemo(() => {
    return featureCollection(
      propertyCoordinates.map((coordinates) =>
        point([coordinates.long, coordinates.lat])
      )
    );
  }, []);

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

  const handleShapeSourceOnPress = (e: any) => {
    console.log(e.features);
  };

  if (!locationPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{errorMsg || "Requesting location permission..."}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/streets-v12"
        onDidFinishLoadingMap={() => setIsMapReady(true)}
      >
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

        {/* Load the pin image first */}
        <Images
          images={{ locationPin }}
          onImageMissing={(imageId) => {
            console.warn("Missing image: ", imageId);
          }}
        />

        {/* Add the property markers with clustering */}
        {isMapReady && (
          <ShapeSource
            id="properties"
            cluster={true}
            shape={perchFeatures}
            onPress={handleShapeSourceOnPress}
          >
            {/* Clustered points count */}
            <SymbolLayer
              id="clusters-count"
              style={{
                textField: ["get", "point_count"],
                textSize: 18,
                textColor: "white",
              }}
            />

            {/* Clustered points circle */}
            <CircleLayer
              id="clusters"
              filter={["has", "point_count"]}
              belowLayerID="clusters-count"
              style={{
                circleColor: "blue",
                circleRadius: [
                  "step",
                  ["get", "point_count"],
                  20,
                  100,
                  30,
                  750,
                  40,
                ],
                circleOpacity: 1,
                circleStrokeWidth: 2,
                circleStrokeColor: "white",
              }}
            />

            {/* Individual points */}
            <SymbolLayer
              id="property-symbols"
              filter={["!", ["has", "point_count"]]}
              style={{
                iconImage: "locationPin",
                iconSize: 0.5,
                iconAllowOverlap: true,
                iconAnchor: "bottom",
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default Map;
