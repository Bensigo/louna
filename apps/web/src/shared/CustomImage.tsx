import { useState, useEffect } from 'react';
import { Skeleton, Image as ChakraImage,type ImageProps } from '@chakra-ui/react';
import axios from 'axios'



type CustomImageProps = {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
} & ImageProps; // Extend ImageProps

const CustomImage: React.FC<CustomImageProps> = ({ src, alt ,width, height, ...rest }) => {
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
      <ChakraImage     src={imageSrc} alt={alt} width={'100%'} height={'100%'}   objectFit={ "cover" } {...rest} />
    </Skeleton>
  );
};

export default CustomImage;
