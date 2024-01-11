import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
} from "react-native";
import { XStack } from "tamagui";

const defaults = {
  height: 200,
  width: Dimensions.get("window").width,
  delay: 10000,
};

const Dot = ({ active, scale }: { active: boolean; scale: Animated.Value }) => (
  <Animated.View
    style={[
      styles.dot,
      {
        backgroundColor: active ? "black" : "gray",
        transform: [{ scale }],
      },
    ]}
  />
);

const Item = ({
  imageUrl,
  height,
  width,
}: {
  imageUrl: string;
  height: number;
  width: number;
}) => (
  <TouchableWithoutFeedback
    style={[styles.imageContainer, { height: height, width: width }]}
  >
    <Image
      source={{ uri: imageUrl }}
      style={[styles.image, { height: height }]}
    />
  </TouchableWithoutFeedback>
);

type CarouselProps = {
  data: string[];
  height?: number;
  width?: number;
  delay?: number;
  onPress?: (id: string) => void;
  onBackPress?: () => void;
};

export const Carousel: React.FC<CarouselProps> = ({
  data,
  height = defaults.height,
  width = defaults.width,
  delay = defaults.delay,
  onPress,
  onBackPress

}) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const scrollView = useRef<ScrollView>(null);
  const dotScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fn = setInterval(() => {
      setselectedIndex((oldCount) =>
        oldCount === data.length - 1 ? 0 : oldCount + 1
      );
    }, delay);
    return () => {
      clearInterval(fn);
    };
  }, []);

  // Script will be executed every time selectedIndex updates
  useEffect(() => {
    scrollView.current?.scrollTo({
      animated: true,
      x: width * selectedIndex,
      y: 0,
    });

    // Animate the dot
    Animated.sequence([
      Animated.timing(dotScale, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(dotScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedIndex]);

  const setIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    setselectedIndex(Math.floor(contentOffset.x / viewSize.width));
  };

  return (
    <View>
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={setIndex}
        onContentSizeChange={() => scrollView.current?.scrollToEnd()}
      >
        <View style={styles.carouselContainer}>
          {data.map((url, index) => (
            <Item key={index} height={height} width={width} imageUrl={url} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.likeBtnContainer}  >
             <Ionicons  name="heart-outline" size={30} color={'red'}  />  
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtnContainer} onPress={onBackPress}>
             <Ionicons  name="arrow-back-outline" size={30}  />  
        </TouchableOpacity>
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <Dot
            key={index}
            active={index === selectedIndex}
            scale={dotScale}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: { backgroundColor: "green" },
  likeBtnContainer: {
    top: 10 ,
    right: 10,
    position: 'absolute',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5 
  },
  backBtnContainer: {
    top: 10 ,
    left: 10,
    position: 'absolute',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5 
  },
  image: {
    width: defaults.width,
    height: defaults.height,
  },
  carouselContainer: {
    flexDirection: "row",
    width: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    margin: 5,
  },
});

export default Carousel;
