import { Box, Button, Flex, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { BiDownArrowAlt, BiRightArrow } from "react-icons/bi";

const MotionBox = motion(Box);

export default function Benefits({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      if (currentIndex === data.length - 1){
          setCurrentIndex(0)
      }else {
        const scrollTop = containerRef.current.scrollTop;
        const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const scrollFraction = scrollTop / scrollHeight;
        const newIndex = Math.min(
          data.length - 1,
          Math.floor(scrollFraction * data.length)
        );
        setCurrentIndex(newIndex);
      }

    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {

      if (currentIndex === data.length - 1) {
        container.addEventListener("scroll", handleScroll);
      } else {
        container.removeEventListener("scroll", handleScroll);
      }
    }
  }, [currentIndex]);

  return (
    <Box overflowY={currentIndex === data.length - 1 ? "scroll" : "hidden"} ref={containerRef} w="100%">
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        alignItems="center"
        justifyContent="center"
 
        p={4}
      >
        {/* Image Stack */}
        <Flex
          position="relative"
          w={{ base: "100%", lg: "50%" }}
          h={{ base: "300px", lg: "500px" }}
          justifyContent="center"
          alignItems="center"
        >
          {data.map((item, index) => (
            <MotionBox
              key={item.imageSrc}
              initial={{ opacity: 0, zIndex: data.length - index }}
              animate={{
                opacity: currentIndex === index ? 1 : 0.5,
                zIndex: currentIndex === index ? data.length : data.length - index,
                x: currentIndex === index ? 0 : (index - currentIndex) * 20,
                y: currentIndex === index ? 0 : (index - currentIndex) * 20,
                scale: currentIndex === index ? 1 : 0.9,
              }}
              transition={{ duration: 0.5 }}
              position="absolute"
              style={{
                width: "70%",
                height: "70%",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #ccc"
              }}
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                layout="fill"
                objectFit="cover"
              />
            </MotionBox>
          ))}
        </Flex>

        {/* Text Content */}
        <VStack
          spacing={4}
          mt={{ base: 6, lg: 0 }}
          textAlign="left"
          w={{ base: "100%", lg: "50%" }}
          p={4}
        >
          <Heading  alignSelf={'flex-start'} as="h3" fontSize="2xl" fontWeight="bold" color={'#40780b'}>
            {data[currentIndex].title}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {data[currentIndex].description}
          </Text>
          <Stack  alignSelf={'flex-start'}>
            <Text as="span"   color="gray.600" fontSize={"smaller"}>Press the button below for next slide</Text>
            <Button
            onClick={handleNextClick}
            bg="#dda044"
            color="#f4e5ce"
            borderRadius="full"
            boxSize={12}
           
            _hover={{ bg: '#d89d3b' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BiRightArrow size={24} />
          </Button>
          </Stack>
          
        </VStack>
      </Flex>

    </Box>
  );
}
