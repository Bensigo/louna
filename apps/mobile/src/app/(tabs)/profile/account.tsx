import { useEffect } from "react"
import { Text, View , Button, Input} from "tamagui"
import { useCustomTabbar } from "../../../context/useCustomTabbar"
import { useRouter } from "expo-router"

import React from 'react';
import {  ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { api } from "../../../utils/api"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Skeleton } from "moti/skeleton"
import { useSafeAreaInsets } from "react-native-safe-area-context"



const UserAccountschema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    age: z.string()
});

export type UserAccountType = z.infer<typeof UserAccountschema>


const AccountScreen = () => {
    const router = useRouter()
    const { hideTabBar, showTabBar } = useCustomTabbar()

    const {data:profile, isLoading } = api.auth.getProfile.useQuery()

    const ctx = api.useUtils()


    const { mutate: updateProfile, isLoading: isSubmiting } = api.auth.updateProfile.useMutation()


    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])


    const onSubmit = ({ firstname, lastname, age }) => {
         updateProfile({
            firstname,
            lastname,
            age
         }, {
            onError: (err) => {
               Alert.alert("Error", err.message, [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => console.log('Cancel Pressed'),
                }
               ])
            }
         })
         ctx.auth.getProfile.invalidate();
         router.push('/profile/settings')

      };


      profile?.birthdate


      if (isLoading){
       return (
        <View flex={1} px={'$4'}>
            <Skeleton  colorMode="light" height={'100%'} width={'100%'}/>
        </View>
       )
      }
      
  
    return (
        <View flex={1} px={'$4'}>
             {/* <LeftBackButton route="/profile" bg="black" /> */}
            {profile && (
                <UserAccountForm  profile={profile} onSubmit={onSubmit} isSubmiting={isSubmiting} />
            )}
        </View>
    )
}


export default AccountScreen





const UserAccountForm = ({ profile, onSubmit, isSubmiting  }) => {
    const insets = useSafeAreaInsets()
    const { control, handleSubmit, formState: { errors } } = useForm<UserAccountType>({
        resolver: zodResolver(UserAccountschema),
        defaultValues: {
            firstname: profile?.firstname || '',
            lastname:  profile?.lastname|| '',
            age:  String(profile?.userPref?.age ||  profile?.age)
        }
    });
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding"  keyboardVerticalOffset={47 + insets.top}>
         <View flex={1} justifyContent="space-between">
        
        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                style={styles.input}
                onChangeText={onChange}
                value={value}
  
                placeholder="Enter your first name"
              />
            )}
            name="firstname"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.firstname && <Text style={styles.error}>First name is required.</Text>}
  
          <Text style={styles.label}>Last Name</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your last name"
              />
            )}
            name="lastname"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.lastname && <Text style={styles.error}>Last name is required.</Text>}  

          <Text style={styles.label}>Age</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                style={styles.input}
                onChangeText={onChange}
                keyboardType="numeric"
                value={value}
             
              />
            )}
            name="age"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.age && <Text style={styles.error}>Age is required.</Text>}  
        </View>
        <Button my={'$4'}  width={'100%'} bg={'black'} color='white'  onPress={handleSubmit(onSubmit)} >
            Save
            {isSubmiting && <ActivityIndicator size={'small'} />}
        </Button>
        </View> 
      </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
   
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});


