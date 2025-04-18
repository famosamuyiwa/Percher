import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
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
import { View, TouchableOpacity, Alert, Text } from "react-native";
import { featureCollection, point } from "@turf/helpers";
import { propertyCoordinates } from "@/constants/data";
import locationPin from "@/assets/images/location-pin.png";
import { useMapContext } from "@/lib/map-provider";
import { Ionicons } from "@expo/vector-icons";
import { Colors, MapSettings } from "@/constants/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "./SearchBar";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { geocode } from "@/api/api.service";
import { GeocodeType } from "@/constants/enums";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
  const insets = useSafeAreaInsets();
  const { query, from } = useLocalSearchParams<{
    query?: string;
    from?: string;
  }>();
  const navigation = useNavigation();

  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const {
    mapMode,
    setSnapshot,
    setSelectedAddress,
    selectedCoordinates,
    setSelectedCoordinates,
    setMapRef,
    setIsLoadingSelectedAddress,
  } = useMapContext();
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [settings, setSettings] = useState(MapSettings[mapMode]);
  const [customMarker, setCustomMarker] = useState<[number, number] | null>(
    null
  );
  const [geocodeResults, setGeocodeResults] = useState<[]>([]);
  const lastPressTime = useRef(0);

  // Set the map reference in the context
  useEffect(() => {
    setMapRef(mapRef);
  }, [mapRef, setMapRef]);

  useEffect(() => {
    if (query) {
      fetchAddress(GeocodeType.FORWARD, [0, 0]);
    }
  }, [query]);

  // Add a new effect to handle taking a snapshot when returning from the bottom sheet
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      // If we have selected coordinates, take a snapshot before navigating back
      if (selectedCoordinates) {
        takeMapSnapshot();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedCoordinates, navigation]);

  // Create a feature collection for the property coordinates
  const perchFeatures = useMemo(() => {
    return featureCollection(
      propertyCoordinates.map((coordinates) =>
        point([coordinates.long, coordinates.lat])
      )
    );
  }, []);

  // Create a feature collection for the custom marker
  const customMarkerFeatures = useMemo(() => {
    if (!customMarker) return featureCollection([]);
    return featureCollection([point(customMarker)]);
  }, [customMarker]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return false;
      }
      setLocationPermission(true);
      return true;
    } catch (error) {
      Alert.alert("Error requesting location permission");
      console.error("Location permission error:", error);
      return false;
    }
  };

  const handleShapeSourceOnPress = (e: any) => {};

  const centerOnUserLocation = async () => {
    try {
      // Request permission if not already granted
      if (!locationPermission) {
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          return;
        }
      }

      // Get current location with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Set the center coordinate
      centerOnCoordinates(
        [location.coords.longitude, location.coords.latitude],
        true
      );
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const centerOnCoordinates = async (
    coordinates: [number, number],
    currentLocation?: boolean
  ) => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: coordinates,
        zoomLevel: currentLocation ? 16 : 14,
        animationDuration: 1000,
      });
    }
  };

  const takeMapSnapshot = async () => {
    if (!mapRef.current) return;

    try {
      // Take the snapshot
      const snapshot = await mapRef.current.takeSnap(true);
      setSnapshot(snapshot);
    } catch (error) {
      console.error("Error taking snapshot:", error);
      Alert.alert("Error", "Failed to take map snapshot");
    }
  };

  // Function to get address from coordinates using Mapbox Geocoding API
  const fetchAddress = async (
    type: GeocodeType,
    coordinates: [number, number]
  ) => {
    try {
      if (type === GeocodeType.REVERSE) {
        setIsLoadingSelectedAddress(true);
      }
      const [longitude, latitude] = coordinates;

      const data = await geocode({
        type,
        longitude,
        latitude,
        query,
      });

      if (type === GeocodeType.FORWARD) {
        setGeocodeResults(data.features);
      }

      if (
        type === GeocodeType.REVERSE &&
        data.features &&
        data.features.length > 0
      ) {
        const address = data.features[0].properties.place_formatted;
        setSelectedAddress(address);
        return address;
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error("Error getting address:", error);
      return "Error getting address";
    } finally {
      setIsLoadingSelectedAddress(false);
    }
  };

  // Optimized map press handler with throttling
  const handleMapPress = useCallback((e: any) => {
    if (!e.geometry) return;

    // Throttle to prevent too many updates
    const now = Date.now();
    if (now - lastPressTime.current < 300) return;
    lastPressTime.current = now;

    // Get the coordinates from the tap event
    const coordinates: [number, number] = [
      e.geometry.coordinates[0],
      e.geometry.coordinates[1],
    ];

    // Set the custom marker at the tapped location
    setCustomMarker(coordinates);
    setSelectedCoordinates(coordinates);
    // Get the address for the coordinates
    fetchAddress(GeocodeType.REVERSE, coordinates);
  }, []);

  const removeCustomMarker = () => {
    setCustomMarker(null);
    setSelectedAddress("");
    setSelectedCoordinates(null);
  };

  const applyMapSettings = () => {
    const settings = MapSettings[mapMode];
    setSettings(settings);
  };

  useEffect(() => {
    applyMapSettings();
  }, [mapMode]);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/streets-v12"
        onDidFinishLoadingMap={() => setIsMapReady(true)}
        scaleBarEnabled={false}
        onPress={handleMapPress}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: 1,
          }}
          animationMode="flyTo"
          animationDuration={1000}
          zoomLevel={10}
          centerCoordinate={[3.38975, 6.453928]} //coordinates for center of lagos, nigeria
        />

        {locationPermission && (
          <>
            <LocationPuck
              puckBearingEnabled={true}
              puckBearing="heading"
              pulsing={{ isEnabled: true }}
            />
          </>
        )}

        {/* Load the pin image first */}
        <Images
          images={{ locationPin }}
          onImageMissing={(imageId) => {
            console.warn("Missing image: ", imageId);
          }}
        />

        {/* Add the property markers with clustering */}
        {isMapReady && settings.showPropertyMarkers && (
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
                circleColor: Colors.primary,
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

        {/* Custom marker - optimized rendering */}
        {customMarker && (
          <ShapeSource id="custom-marker" shape={customMarkerFeatures}>
            <SymbolLayer
              id="custom-marker-symbol"
              style={{
                iconImage: "locationPin",
                iconSize: 0.7,
                iconAllowOverlap: true,
                iconAnchor: "bottom",
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      <View className="absolute right-4 gap-5" style={{ top: insets.top + 20 }}>
        <TouchableOpacity
          className="bg-white rounded-full w-11 h-11 justify-center items-center shadow-md"
          onPress={() => {}}
        >
          <Ionicons name={"settings-outline"} size={24} color={Colors.accent} />
        </TouchableOpacity>
        {/* Custom get current user location button */}
        <TouchableOpacity
          className="bg-white rounded-full w-11 h-11 justify-center items-center shadow-md"
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={24} color={Colors.accent} />
        </TouchableOpacity>

        {/* Remove marker button */}
        {customMarker && (
          <TouchableOpacity
            className="bg-white rounded-full w-11 h-11 justify-center items-center shadow-md"
            onPress={removeCustomMarker}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      <View
        className="absolute w-9/12 mx-5 gap-2"
        style={{ top: insets.top + 20 }}
      >
        <SearchBar placeholder="Search for a location" className="bg-white" />
        {geocodeResults.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(500)}
            className="flex-grow bg-white w-full"
          >
            {geocodeResults.map((result: any) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => {
                  centerOnCoordinates([
                    result.geometry.coordinates[0],
                    result.geometry.coordinates[1],
                  ]);
                  setGeocodeResults([]);
                }}
                className="p-4"
              >
                <Text key={result.id}>{result.properties.full_address}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default Map;
