

import React from 'react';
import { useEffect } from "react"
import {   Text, View } from "tamagui"
import { useCustomTabbar } from "../../context/useCustomTabbar"
import { useRouter } from "expo-router"
import { TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';




type SettingListType = { iconName: React.ComponentProps<typeof Ionicons>['name'], title: string, onPress: () => void }

const SettingsListItem = ({ iconName, title, onPress }: SettingListType) => {
  return (
    <TouchableOpacity onPress={onPress}>
    <View>
      <View style={styles.item}>
        <Ionicons name={iconName} size={24} color="black" style={styles.icon} />
        <Text>{title}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  </TouchableOpacity>
  );
};





const SettingsScreen = () => {
    const { signOut } = useAuth()
    const router = useRouter()
    const { hideTabBar, showTabBar } = useCustomTabbar()


    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])


    const handleLogout = () => {
       signOut()
       router.replace('/')
    };


    const gotToRoute = (name: string) => router.push(name)

    const settingsData: {
      title: string,
      data: SettingListType[]
    }[] = [
        {
          title: 'Account',
          data: [
            { iconName: 'person-outline', title: 'User Account', onPress: () => gotToRoute('/profile/account') },
            { iconName: 'document-text-outline', title: 'Privacy Policy', onPress: () => console.log('Navigate to Privacy Policy') },
          ],
        },
        {
          title: 'Preferences',
          data: [
            { iconName: 'notifications-outline', title: 'Notification', onPress: () => console.log('Navigate to Notification settings') },
            { iconName: 'settings-outline', title: 'User Preference', onPress: () => gotToRoute('/profile/preference') },
            { iconName: 'gift-outline', title: 'Subscriptions and Top-ups', onPress: () => gotToRoute('/profile/plans') },
          ],
        },
        {
          title: 'Help & Logout',
          data: [
            { iconName: 'help-circle-outline', title: 'Help', onPress: () => console.log('Navigate to Help') },
            { iconName: 'log-out-outline', title: 'Logout', onPress: handleLogout },
          ],
        },
      ];

  
    return (
        <View flex={1} px={'$4'}>
      <SectionList
        sections={settingsData}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <SettingsListItem
            iconName={item.iconName}
            title={item.title}
            onPress={item.onPress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
 
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      },
      icon: {
        marginRight: 20,
      },
      separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
      },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
   
  });
  
  


export default SettingsScreen