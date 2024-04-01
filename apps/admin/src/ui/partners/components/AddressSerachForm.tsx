import { FormControl, FormErrorMessage, Input, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { useDebouncedCallback } from "use-debounce";

export type LocationSearchInput = {
  name: string;
  latitude: number;
  longitude: number;
};

type AddressSerachInputProps = {
  onChange: (value: string) => void;
  onSelect: (place: LocationSearchInput) => void;
  onClear: () => void
  address?: {
    name: string,
    lat: string,
    log: string
  }
};

const AddressSerachInput: React.FC<AddressSerachInputProps> = ({ onChange, onSelect, onClear, address }) => {
  const [inputValue, setInputValue] = useState<string>(address?.name || '');
  const [suggestions, setSuggestions] = useState<LocationSearchInput[]>([]);
  const [isSelected, setIsSelected ] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log({ value })
    setInputValue(value);
    setIsSelected(false)
    onChange(value);
  };

  const handleSelect = (place: LocationSearchInput) => {
    setInputValue(place.name);
    setSuggestions([]);
    setIsSelected(true)
    onSelect(place);
   
  };




  const handleClearInput = () => {
    setInputValue("");
    setSuggestions([]);
    onClear()
  };

  const fetchSuggestions = useDebouncedCallback(async (query: string) => {
    console.log({ query })
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
   
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ae&type=address&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
    const data = await response.json();
    
    const places: Place[] = data?.features?.map((feature: any) => ({
      name: feature.place_name,
      latitude: feature.center[1],
      longitude: feature.center[0],
    }));
    setSuggestions(places);
  }, 300);

  useEffect(() => {
    console.log('called===', inputValue)
    if (!isSelected || !address){
      fetchSuggestions(inputValue);
    }
  
  }, [inputValue, isSelected, fetchSuggestions, address]);




  return (
    <VStack align="stretch" spacing={2}>
      <FormControl isInvalid={false}>
        <Input
          value={inputValue}
          onChange={handleChange}
          placeholder="Search for an address"
          paddingRight={10} // Add space for the clear button
        />
        <IconButton
          aria-label="Clear input"
          icon={<BiXCircle  color="red"/>}
          size="sm"
        
          variant="ghost"
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          onClick={handleClearInput}
          display={inputValue ? "block" : "none"}
        />
        <FormErrorMessage>{/* Error message */}</FormErrorMessage>
      </FormControl>
      {suggestions && suggestions.map((place, index) => (
        <div
          key={index}
          onClick={() => handleSelect(place)}
          style={{ cursor: "pointer" }}
        >
          {place.name}
        </div>
      ))}
    </VStack>
  );
};

export default AddressSerachInput;
