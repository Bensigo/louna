
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { H2, View } from 'tamagui'

export default function Upcoming() {
  const router = useRouter()
  const goBack = () => {
    router.back()
  }  
  return (
        <View px={10}>
            <TouchableOpacity style={{ marginBottom: 15 }} onPress={goBack}>
                <Ionicons name='arrow-back-outline' size={25} />
            </TouchableOpacity>
            <H2 fontWeight={'$10'}>Upcoming</H2>
        </View>
  )
}
