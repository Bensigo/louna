import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import CustomImage from "../CustomImage";
import { buildFileUrl } from "../../utils/buildUrl";

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
}) => {
  return (
    <TouchableWithoutFeedback
    style={[styles.imageContainer, { height: height, width: width }]}
  >
 
    <CustomImage  src={imageUrl} height={height} width={width} alt={"image"}/>
  </TouchableWithoutFeedback>
  )
};

type CarouselProps = {
  data: {repo: string, key: string}[];
  height?: number;
  width?: number;
  delay?: number;
  onPress?: (id: string) => void;
  onBackPress?: () => void;
  onLike: () => void;
  isLike: boolean;
  isLikePress: boolean
  showLike?: boolean
};

export const Carousel: React.FC<CarouselProps> = ({
  data: images,
  height = defaults.height,
  width = defaults.width,
  delay = defaults.delay,
  onBackPress,
  onLike,
  isLike,
  isLikePress,
  showLike = true 

}) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const scrollView = useRef<ScrollView>(null);
  const dotScale = useRef(new Animated.Value(1)).current;



  useEffect(() => {
    const fn = setInterval(() => {
      setselectedIndex((oldCount) =>
        oldCount === images.length - 1 ? 0 : oldCount + 1
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
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={setIndex}
        onContentSizeChange={() => scrollView.current?.scrollToEnd()}
      >
        <View style={styles.carouselContainer}>
          {images.map((image, index) => (
            <Item key={image.key} height={height} width={width} imageUrl={buildFileUrl(image.repo, image.key)} />
          ))}
        </View>
      </ScrollView>
     {showLike && <TouchableOpacity style={styles.likeBtnContainer} onPress={onLike}  >
            
             {isLikePress? (
                                    <ActivityIndicator size={'small'} />
                                ) : (
                                    <Ionicons
                                        name={isLike? 'heart': "heart-outline"}
                                     
                                        style={isLike && { color: 'red'}}
                                        size={25}
                                    />
                                )}
        </TouchableOpacity>}
        <TouchableOpacity style={styles.backBtnContainer} onPress={onBackPress}>
             <Ionicons  name="arrow-back-outline" size={30}  />  
        </TouchableOpacity>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
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
