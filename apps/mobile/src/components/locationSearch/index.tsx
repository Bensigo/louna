import React, { useCallback, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import debounce from "lodash/debounce";
import { Input } from "tamagui";

import { Colors, colorScheme } from "~/constants/colors";

interface Location {
  title: string;
  position: {
    lat: number;
    lng: number;
  };
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [zoomLevel, setZoomLevel] = useState(15);

  const debouncedSearchLocation = useCallback(
    debounce(async (query: string) => {
      try {
        const response = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode`,
          {
            params: {
              q: query,

              lang: "EN",
              apiKey: "lh3SOQ_UY1BemPOxlFiKB2kPHepYdnjzvZsx2ytbsWw", // Replace with your Here Maps API key
            },
          },
        );

        const locations = response.data.items.map((item: any) => ({
          title: item.title,
          position: item.position,
        }));
        setSuggestions(locations);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }, 500),
    [],
  );

  const handleSuggestionSelect = (location: Location) => {
    setSelectedLocation(location);
    setSuggestions([]);
    onLocationSelect(location);
  };

  return (
    <View>
      <Input
        placeholder="Search for location"
        backgroundColor={'white'}
        color={colorScheme.secondary.gray}
        onChangeText={(text) => {
          setSearchQuery(text);
          debouncedSearchLocation(text);
        }}
        value={searchQuery}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.title}
          style={{ elevation: 3, backgroundColor: "white" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionSelect(item)}
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light.text,
              }}
            >
              <View style={{ padding: 8 }}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {selectedLocation && (
        <>
          <MapView
            style={{ height: 200, marginTop: 10 }}
            initialRegion={{
              latitude: selectedLocation.position.lat,
              longitude: selectedLocation.position.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={{
              latitude: selectedLocation.position.lat,
              longitude: selectedLocation.position.lng,
              latitudeDelta: 0.0922 / zoomLevel,
              longitudeDelta: 0.0421 / zoomLevel,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedLocation.position.lat,
                longitude: selectedLocation.position.lng,
              }}
              title={selectedLocation.title}
            />
          </MapView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Button
              title="+"
              onPress={() => setZoomLevel((prev) => Math.min(prev + 1, 20))}
            />
            <Button
              title="-"
              onPress={() => setZoomLevel((prev) => Math.max(prev - 1, 1))}
            />
          </View>
        </>
      )}
    </View>
  );
};
