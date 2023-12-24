import {
  Container,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useCustomAuth } from '~/context/authContext'


const Home = () => {

 
  const router = useRouter()

  const { isInstructor, hasSetup, isSignedIn, isLoading } = useCustomAuth()

  React.useEffect(() => {
      if(isLoading)return;
  }, [isLoading])


  React.useEffect(() => {
      if(!isLoading && isSignedIn){
          if(hasSetup && isInstructor){
              router.push('/dashboard/profile')
          }else {
              router.push('/dashboard/setup')
          }
          
      }
  }, [isInstructor, hasSetup, isSignedIn, isLoading, router])
  
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Text>Hello world</Text>
  </Container>

  )
}

export default Home
