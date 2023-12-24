import { Container, Box, Heading, Avatar, Stack, useToast } from '@chakra-ui/react'
import React from 'react'
import { api } from '~/utils/api'
import SetupForm, { type SetupSchemaType } from './components/SetupForm'
import { useCustomAuth } from '~/context/authContext'
import { useRouter } from 'next/router'

function SetupWrapper() {
  const { mutate , isLoading } =  api.profile.create.useMutation()
  const context = api.useUtils()
  const { user }  = useCustomAuth()
  const toast = useToast()
  const router = useRouter()


  const handleCreatePartner = (data: SetupSchemaType) => {

      mutate({
        ...data
      }, {
        onSuccess: () => {
             context.profile.get.invalidate()
            router.push('/dashboard/profile')

        },
        onError: (err) => {
          toast({
            title: 'Error',
            isClosable: true,
            status: 'error',
            description: err.message
          })
        }
      })
  }
   return (
   <Container py={10}>
        <Stack spacing={3}>
          <Avatar size='xl' name={`${user?.firstname} } ${user?.lastname}`} src={user?.imageUrl as string}  />
          <Heading mb={5} size={'md'} as={'h6'}>Hey {user?.firstname},  one more step to your profile</Heading>

        </Stack>
        <Box >
             
            <SetupForm onSubmit={handleCreatePartner} isLoading={isLoading} />
        </Box>
   </Container>
  )
}

export default SetupWrapper