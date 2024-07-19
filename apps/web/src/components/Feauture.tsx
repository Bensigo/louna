// src/FeaturesSection.js
import React from 'react';
import { Box, Flex, Text, Image, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';

const FeatureCard = ({ number, title, description, imgSrc, reverse }) => {
    const direction = useBreakpointValue({ base: 'column', md: reverse ? 'row-reverse' : 'row' });
  
    return (
      <Flex direction={direction} alignItems="center" my="8">
        <Box
          flexShrink="0"
          mb={['4', '0']}
          mr={reverse ? ['0', '8'] : ['0', '8']}
          ml={reverse ? ['0', '8'] : ['0', '8']}
          width={['100%', '380px']}
          height={['auto', '500px']}
          transform={['none', 'translateY(-20px)']}
        >
          <Image src={imgSrc} alt={title} borderRadius="lg" objectFit="cover" width="100%" height="100%" />
        </Box>
        <Box textAlign={reverse ? ['left', 'right'] : ['left', 'left']} maxWidth="600px" ml={reverse ? 'auto' : '8'}>
          <Heading  as="h3" size={{ base: 'lg', md: '3xl' }} color="#dda044" mb="2">
            {number}
          </Heading>
          <Heading as="h4" size="xl" mb="4" color="#40780b">
            {title}
          </Heading>
          <Text fontSize="lg" color="gray.600" >
            {description}
          </Text>
        </Box>
      </Flex>
    );
  };
  
const isPrimeNum = (num: number) => (num%2) === 0

const FeaturesSection = ({ data }: { data: any[]}) => (
  <Box p="8">
    <Stack spacing={2} alignItems={'center'}>
     {data.map((item, i) => (
        <FeatureCard
        number={i + 1}
        title={item.title}
        description={item.description}
        imgSrc={item.imageSrc}
        reverse={isPrimeNum(i + 1)}
      />
     )) 
   }
    </Stack>
  </Box>
);

export default FeaturesSection;
