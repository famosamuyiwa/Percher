import { MapMode } from "@/constants/enums";
import { Property } from "@/interfaces";
import { PropsWithChildren, createContext, useContext, useState } from "react";

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
  setSelectedCoordinates: (coordinates: [number, number]) => void;
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
