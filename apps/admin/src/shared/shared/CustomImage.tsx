import { useState, useEffect } from 'react';
import { Skeleton, Image as ChakraImage } from '@chakra-ui/react';
import axios from 'axios'

const CustomImage = ({ src, alt, width, height }: { src: string, alt: string, width: number | string, height: number | string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      try {
        console.log({ src })
        const response = await axios.get(src);
        // const objectUrl = URL.createObjectURL(blob);
        setImageSrc(response.data);
        console.log({response}, '--')
      } catch (error) {
        console.error('Error loading image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);
  console.log(imageSrc)
  return (
    <Skeleton isLoaded={!isLoading} height={height} width={width} >
      <ChakraImage src={imageSrc} alt={alt} width={'100%'} height={'100%'}  objectFit="cover" borderRadius={10} />
    </Skeleton>
  );
};

export default CustomImage;
