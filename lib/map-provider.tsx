import { MapMode } from "@/constants/enums";
import { Property } from "@/interfaces";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useRef,
} from "react";
import { MapView } from "@rnmapbox/maps";

interface MapContextType {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  snapshot: string;
  setSnapshot: (snapshot: string) => void;
  selectedAddress: string | null;
  setSelectedAddress: (address: string) => void;
  isLoadingSelectedAddress: boolean;
  setIsLoadingSelectedAddress: (isLoading: boolean) => void;
  selectedCoordinates: [number, number] | null;
  setSelectedCoordinates: (coordinates: [number, number] | null) => void;
  mapRef: React.RefObject<MapView> | null;
  setMapRef: (ref: React.RefObject<MapView>) => void;
  takeMapSnapshot: () => Promise<void>;
  resetMap: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: PropsWithChildren) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.DEFAULT);
  const [snapshot, setSnapshot] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoadingSelectedAddress, setIsLoadingSelectedAddress] =
    useState<boolean>(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [mapRef, setMapRef] = useState<React.RefObject<MapView> | null>(null);

  const takeMapSnapshot = async (): Promise<void> => {
    if (!mapRef?.current) return;

    try {
      // Take the snapshot
      const snapshotResult = await mapRef.current.takeSnap(true);
      console.log("snapshot: ", snapshotResult);

      setSnapshot(snapshotResult);
    } catch (error) {
      console.error("Error taking snapshot:", error);
    }
  };

  const resetMap = () => {
    setSelectedProperty(null);
    setMapMode(MapMode.DEFAULT);
    setSnapshot("");
    setSelectedAddress(null);
    setIsLoadingSelectedAddress(false);
    setSelectedCoordinates(null);
  };

  return (
    <MapContext.Provider
      value={{
        selectedProperty,
        setSelectedProperty,
        mapMode,
        setMapMode,
        snapshot,
        setSnapshot,
        selectedAddress,
        setSelectedAddress,
        isLoadingSelectedAddress,
        setIsLoadingSelectedAddress,
        selectedCoordinates,
        setSelectedCoordinates,
        mapRef,
        setMapRef,
        takeMapSnapshot,
        resetMap,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

export default MapProvider;
