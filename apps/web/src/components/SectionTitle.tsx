import { type ReactNode } from 'react';
import {  Container, Heading, Text } from '@chakra-ui/react';

interface SectionTitleProps {
  pretitle?: string;
  title?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ pretitle, title, align = 'center', children }) => {
  return (
    <Container my={2} maxW="container.md" mt={4} textAlign={align === 'left' ? 'left' : 'center'}>
      {pretitle && (
        <Text fontSize="sm" fontWeight="bold" letterSpacing="wider" textTransform="uppercase" color="indigo.600">
          {pretitle}
        </Text>
      )}

      {title && (
        <Heading as="h2" maxW="2xl" mt={3} fontSize={{ base: '3xl', lg: '4xl' }} fontWeight="bold" lineHeight="tight" color={'#40780b'} _dark={{ color: 'white' }}>
          {title}
        </Heading>
      )}

      {children && (
        <Text maxW="2xl" py={4} fontSize={{ base: 'lg', lg: 'xl' }} lineHeight="normal" color="gray.500" _dark={{ color: 'gray.300' }}>
          {children}
        </Text>
      )}
    </Container>
  );
};

export default SectionTitle;
