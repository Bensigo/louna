import React, { useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import CustomImage from './CustomImage';
import { buildFileUrlV2 } from '~/utils/getFileurl';

export interface Slide {
  key: string;
  repo: string;
}

interface CarouselProps {
  slides: Slide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <Flex direction="column" align="center">
      <Box width="100%" overflow="hidden" position="relative">
        {slides.map((slide, index) => (
          <Box
            key={index}
            display={index === currentIndex ? 'block' : 'none'}
            borderWidth={10}
            top="0"
            backgroundColor={'black'}
            left="0"
            width="100%"
            px={'auto'}
            height={600}
            transition="opacity 0.3s ease-in-out"
          >
            <CustomImage
              width="100%"
              height={600}
              src={buildFileUrlV2(`${slide.repo}/${slide.key}`)}
              alt={`Slide ${index + 1}`}
            />
          </Box>
        ))}
      </Box>
      <Flex mt={4}>
        <Button onClick={goToPrevSlide} mr={2}>
          Prev
        </Button>
        <Button onClick={goToNextSlide}>Next</Button>
      </Flex>
    </Flex>
  );
};

export default Carousel;
