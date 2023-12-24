/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react'
import { Animated, StyleSheet, useWindowDimensions } from 'react-native'
import { View } from 'tamagui'


interface PaginatorType  {
    data: any
    scrollX: any
}


const Paginator: React.FunctionComponent<PaginatorType> = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();
    return (
      <View flexDirection="row" height={64} justifyContent="center" alignItems="center">
        {data.map((_, i: number) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          return <Animated.View key={i.toString()} style={[styles.dot, { width: dotWidth }]} />;
        })}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    dot: {
      marginTop: 5,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 8,
      backgroundColor: 'black',
    },
  });
  
  export { Paginator };
  