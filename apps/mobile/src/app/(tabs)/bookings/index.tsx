import React, { useEffect, useState } from "react"
import {
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { addDays, format, isSameDay, startOfDay } from "date-fns"
import {
    Button,
    H2,
    H4,
    H6,
    Image,
    ScrollView,
    SizableText,
    Tabs,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import { WorkOutView } from "../../../components/workoutView"
import { api } from "../../../utils/api"

const DateCalendarTabs = ({ onDatePress }) => {
    const [dates, setDates] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const today = new Date()
    const { width: DEVICE_WIDTH } = useWindowDimensions()

    useEffect(() => {
        // Get the current date
        const currentDate = startOfDay(today)

        // Generate the next 10 days
        const nextDays = Array.from({ length: 10 }, (_, index) =>
            format(addDays(currentDate, index), "MMM dd"),
        )

        setDates(nextDays)
    }, [])

    const handlePress = (index: number, date: string) => {
        setSelectedIndex(index)
        onDatePress(date)
    }

    const compStyle = StyleSheet.create({
        tab: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginRight: 10,
        },
        selectedTab: {
            backgroundColor: "black",
        },
        tabText: {
            color: "black", // Default text color
        },
        selectedTabText: {
            color: "white", // Text color when selected
        },
    })

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            width={DEVICE_WIDTH}
            flexDirection="row"
           
        >
            {dates.map((date, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(index, date)}
                    style={[
                        compStyle.tab,
                        index === selectedIndex && compStyle.selectedTab,
                    ]}
                >
                    <Text
                        style={[
                            compStyle.tabText,
                            index === selectedIndex && compStyle.selectedTabText,
                        ]}
                    >
                        {index === 0 ? "Today" : date}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const tabs = ["By Date", "By Instructor", "By Category"]

const AvatarItem = ({ avatar, onPress }) => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ margin: 10, marginBottom: 20 }}
        >
            <View alignItems="center">
                <Image
                    source={{ uri: avatar.image }}
                    resizeMode="cover"
                    style={{ width: 150, height: 150, borderRadius: 100 }}
                />
                <Text mt="$3">{`${avatar.firstName} ${avatar.lastName}`}</Text>
            </View>
        </TouchableOpacity>
    )
}

const avatars = [
    {
        id: "1",
        firstName: "Holy",
        lastName: "Doe",
        image: "https://img.freepik.com/premium-photo/exercise-black-woman-athlete-stretching-fitness-wellness-health-doing-training-focus-sportswear-female-trainer-healthy-girl-doing-workout-warm-up-body-care-outdoor_590464-94303.jpg",
    },
    {
        id: "2",
        firstName: "Debbie",
        lastName: "White",
        image: "data:image/jpeg;base64,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",
    },
    {
        id: "3",
        firstName: "Vanessa",
        lastName: "Smith",
        image: "https://as2.ftcdn.net/v2/jpg/05/59/11/71/1000_F_559117107_zXFRDsN7gq6jOS7HhNVWceDxCMTvKRM3.jpg",
    },
]

const catImg =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQDxAPDw8PDw8PDw8PDxAPDw8QDw8PFRUWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGDElHx4tLS0tLS0tLS0rKy0tLS0tKy0tLS4rLS0tLS0rLSstLS0tLS0tLS0tKy0rLS0tLSstLf/AABEIANQA7gMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAACAAEDBAUGBwj/xABCEAACAQIDBQUECAMFCQAAAAAAAQIDEQQSIQUxQVFhBhMicYEUMmKRB0JScqGxwdEj4fAVM5KiwhZDU1RjgpPS8f/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgQDBf/EACURAQACAgAFBQEBAQAAAAAAAAABAgMREhMhMUEEFCJRYfDxkf/aAAwDAQACEQMRAD8AFMliQokTNtJoyJoMrRZLBhFqDJUyvBkyYEgrDJjtgPFikMhmwHuEwIkiASRIojIkQCVM5zbfbHDYZ5IP2mte2Sk1li/il+iuyTtZ7RUisPh1JRmv40478n2Y8fOxxuLp0sFFZYJy3OTXivbcNwsxMJ9q9rNoJZ33WHpv3YxgnO3BvNf5oo7J+kPFU6i76Ua9N74yUYu3OMktH53Rze2dpzrScpyu+HRGQpalll9HbJ2lTxVGNei7xldWfvRkt8WuZbaPJ/oz226VdUG/4eIcYtfZqboTXnu9VyPWWyKZCY4zAYZjjMBhmOMALGCYwDCEOQcxEMFDXKJYslgyuiSLAtQZLFlaDJlICZSCuQqQWYCTMDcByHiBLFh3I4kiAOLJIsiiSRKNCniqKi4SlBzjTTcLpyTk29eXryPMu2exqlXNUhaW/R+8lyT4+tzvP7GU8+IhaM2lSnaUoXV4t1NN8klbXgY3ajF04ruqeqSy359Tgtea3fRxUrejyfZ2wJ4ipkb7vVRTcZScqknaMIpc3x3JJ9L5G0cDPD1Z0aitOEsr5Pquh6lsyvRp0sRUrwpVMsYZI1W7upKaisqT3pXleztl8jids1lXxFWbVlVm3HMtUkrRfnZI965JtP48L4KxXp3UOze0YYfEU6tRSlCnONS0bZm4+JRV+bSPaOznavD45uNJyjUjCM5QmrPXR5X9azsm1zR4k9j18qnCjUqQlKUFKnGU1mW+LtueqPRvo17LVsPVnisVB0pZFTo03JXyy1lKSW7ckk9d+m49ocv49EuM2JMZsoa4riY1wENcQwCGHGAQ9xhiDmUK4wxVGmSRZCmSRZBNFkiZCmFmKJ1ILMV1IkUgiYOJFFksQJIkhHElAdMkiAkSRAHE4maUYyrUqVBKV04fxJ1HuWdytbfpa+hyW0IrPJyafFHYuN0072aadm07Pqc3tbs/Wq1FClaFNrxVZyT05KK1bOTNhmb8UeXd6fPEV4beHC4irnrRivtIh2tgctRO2h2uL7HrDypVKc5VFdRqOSSalwaS4B7T2RB0XOWjV7c23uSMTPBbT1jV68Sx9HFvY5JJXVeon8k/1OpZx/Y6r7JSmq1OdOjUlnWI0lRg938S2sF8Vsq4tHYSR2Uno+fkj5SYFjgs0wTGEIBhCEA4whmAmwbibBbIObENEkSKpoomo0ZS92MpeSbQMHladk7NO0ldO3BrijRrY+FaKVWdajJ6SnhlTc2r6K9RNxVuEWl0PO9pjtDeOtZn5TpT7iV8tkndK0pQTv5NjVaEoylGSd4uz0f9cUbGDwWy0mn4nUd2sTJzlKS4rvG7P7tizVwez6K71YeFSpfwtuclrzu7HhzrRPWHRyKTHTbnYokRsva2Gfv0qOmloxSsuWg3t+Bv/cQ/wxHufw9r+/3/AFlKtFb5RXnJE1Oon7qlL7sJS/JGnHauDj7tGMfKKRL/ALQ4dL3svoPcSvtY/WTKtl3063pSqfsRPa9JO0u8h96lUX6BbV7R5HelUjJct7Mz+3ZVLSk6d/he4c6/dqPTU/v8Bju1jp1XCngsViIL/eUouWbyilu82if+3sTK3c7MxDurvv5RotPlbX8w5bfaVk0vRFSrtyf22X3Fvo9pX7b+ypYuok61Cjh1fVuu5u2lrQUf9RexdeFNazu/h0OJntmf2n8ylX2lKW9s87ZL2brgpVu7Qx8ZX3eupye08c6c7x8Vnue4nVRtlLG0L6kr0l6X6w39m9vKbjGniI1KNnZVIJTgl8Ud9vK/kdFsyKjPvqFeNfA14wp04wk3DC11meRRfuQknotyaUdLxR5LiqB0XYevWyYqFFpuWHqzjB+731OOenL/ABRidVbOHJR6gwWyLC4mNWnTqw1hVhGpH7skmvzJLnq5yuIYQDiGFcBDNjNjNgM2C2M2C2QYUYhoESKomCOIgdeSfmkySjLKmopJS32VvyAQUUSaxPeGovaOkSdQXJC7iL3xX5BIJF1CcUx5RvAwfBrykyOeyE9036pMuRJIszOOs+G4zXjy53F9m6j9ycPVtfoVsL2Wrq9504q99ZN/kjrkw0xy6nPs5uPZir/xaf8An/YKXZirwqUvnNfodLFhpk5VV9xf7cxT7K1W/HVpxXw5pP5WRdodkqS/vKtSfSKjBfqbiYaZeVWPCTnvPl5f2pxMMJtBUKbaoqnTU7vM41JeLNd8LOOhrLDZoX38uT6o4ftViu+xderwlVll+6naP+VIPY3aWrho5LKpT4QldOP3ZcF01M5cG43VvD6nhnV2xtGha+hb7E4uOHrVaknaEKFScr7rR1a+Rg47tRn3Ubec/wCRi1Nozk3rli9Go7muT5maY7R3ay5qT2evfRxje8wXd2a7irOnFSlmfdvxxV+mZx/7TqDgfonxMXDE08yz54VMr35cqV0vO/zR3rZ7uUmM2M2M2A7Y2YFsZsAnIByGbBbATYrgXFcisYcFD3KghXGEFGg4gIOIBoJAINBBoNMjTCTAkTDTIUyRMCVMJMiiw4gSphxZEg0UeJdp8L3OLr0rWUaksq+B+KH+Voxrnr/bTsp7alVotQxMI5fFpCrHhGT4Na2fo+nk2JwsqcpQnFxnBuMoy3xktGjcSxMK02ASwpSk8sU5S5RTb/Av0di1N9T+GutnJ+h5XmI7t1rM9ob30b15+2UlTjKblmjOMeFNrWT6LR+iR682eObB2hLA1FOjpZpvnK3Bs9cw2MhXpwr0vcqLMvhf1oPqn+hIttq1JrCVsFsTYDZpk7YLYzY1wHuM2CxMBCGERWNccAe4QdxJgjoCRMkRFElRQSCAuFcA0ODcOPD+uf7AOGmAufRfp+4cevQA0HECC3dSSC/f+vmUEg4mXitqqDklTlPLbVSVnflvI1t5WTdGet/rI8+bX7evJv8ATcgtfn66bjn+0mxMNOXfSoQlUk0pSebxJK2qvZ6JfIuLbcLu8KitxsmvzHx+Ip1YeGazRu0pXTe/TXyMXtFq/GereOk1tE2jo5bERhDw04wgktFGKivwMPHO5qbSmk5XstHLjuV+vQ57G7Tgo6JS3a35q+nX+Xp40rMum+SsK9VJaydkt7ZZ2R2xq4XNSo5e7nKLbqJyytfWirrfuOdrVJz1k/JcPQicTqrj11lw3y76Q992bjFXo06sWmpwi3bcpW8S9HcmbPJ+xXaF4WeSWtKbWeN+P2l1/M9UpVozipwkpRkrprczbzE2DcTBuRT3GuM2NcArj3AuPcisa46GEgCCQAcSoNBoFBIAkEgLhJgEEmCOgDTJIyIkSICWnJX1dlxfH06h7XxNNJwjaMd+7VpbrlDaV+6bjo4uEvlJGbjazxE34raas5c9p3p3elpGuLyq4zGRk2lbetbLgZ81mZRxNdQqOKd7MmoYi548Lo4vCeUHwduq0YzlV1tNvzs/z9fmTRZFKbG1mIZ216FSvrKdvDlsorK+rXM5avGdJum2npv+H9TuYVDmu1NLWE1zyv8Ar0OjDed6cnqMca4oYs5tpXe7REbXQZjKR1OAVOVne7XlY7bsn2glRajKTnSds0bar4o9enH5HDNk+ExDhK5Fe8KSklKLTjJJprc09U0MY3Y/HKthIc6V6bXlrH8GvkbJGjDMdjEUhCEBkCGQaQCSDQyQSRUEh0MhwCHQKCQBIJApB2AdBpgINAFKKknF7mrMxJ4fJmi1ZvibkSHaGHzwuvej+K5HjmpxRuPDo9Pl4LantLhdo4BSburtbnxMeOenNLPaDdrzu8vW++x1eLpX1MnG4a6vY8K2+3ZenmFmjVlFLMtOEovNF+pNo9xhYOvKm8qbVtUt6lH7LXE63D7N72kqtHW/vQ4p9OaE1+ki+o6sxwM3beEc6M0lqlmXmtTblRadmrW4DSo3MxOp21aItGnmQzL22MF3NecLWV80PuPd+q9CjY+hE7jb5MxqdSZjBWFYmk29D+i2s3HEx4LuX6vP+34HdNnLfR5s10cJ3klaWIl3iXHu0rQ+er9UdOyysHuM2CxrkUYgExyKzIoNRJo0wsoEKQSRIohqmBDYViwqQcaXQqKyQaXQsql0DVMCrlHsy33Qu5fICqkw0WVh2F7MBXiSxJ44YljhgOY2vhMrzJeGX4PkYtSlo0ehV8AqkHB8Vo+T4M4rHYaUJShLSUHZ/ucmWmp2+hgycUanvDlMbSyyut6dzpOyGNy1e7v4Zq6MjaML+ZpdjtjVMS88KkKaoSUajldySldq0Vv48VuYrvwt9RvbtcThYVPfim+e6XzM6rsWP1ZNdJJM6athMrtvslrz6kEqC5HRNKz3hw1yWr2l512t7K1KtOMqUVUqxlZKLSvF775ref8A9OX/ANjMb/y7/wDLQ/8Ac9olQA7k1X4xqGbzxTuXjsOxGNe+il51aX6SN3YXYLLJVMXKMlF3VGF2pP45cui+Z6L3HQb2c1xM6Um+lgWzQ9mB9mMqzmwWzS9lAlgwqgmEmW/Y2JYNgGtnsdbONVINQAyYbNJ1s9GiohKIFCOBRJHBLkXVEJIIp+yLkOsKuRdSFYCn7MglhkW1EfKBU9mHWHLVh8oFVUAo0C0oj5QIFSMTtXsvPT7+K8VNeP4qfP0/K50dh1czaNxpqlprO4eOTwM6srUac6r4qnGU7edtx0nYrYGIwtedSqo04V6fdum5pzcrpwk7XStqt9/E9D0eq7xVtFySsjGx9JtPmtU+v6ma49PXJnm/TSzTSnG105Q8Mra9UJ4cq0a1oyq+6nG1vi6c7amph5KcIyV9VfU3t46UnhgPZjTyA5AjP9lHWFNDILKBQWF6C9kNBQCyAZvsgvYzRyjqJFZywaF7EjSUR8oGQoBZC6qPQfulyRpFPIPlLfd9ELJ0QFbKFYmcBZAIlEJRJcglECPKPlJMo9gI8o6iSWEAFhWDGcrcG/JEBUaad78OCJ4xjdJJN9f5lNwqPxQhllorzeWLXJl2NK1sy4PM9LeSXEAZK6dnu1vZNK+4xsTPxOFSVrrRrWMtE9Glya3m5OukrJ2X4v04GdXjCayyjmV82rd0+DT3piBi4epKClBxTpZsqlm1Tf1UrbuPqa2zZ2zU292sVyXIo7RgsuSEWknm5+Lm2VqG0VOqoxzZ4rx/w6mVSsr2dsvHmJXu6RgtlVTnLdF+ugss+QRYzCzlbJIVmQWe8HVQqgthVzOPnKWcbvGBezhKZnqbCjUYGjkFlCGZUDlBkgmgWigWhCsKwCuNm6D2EAOfoNnZIMBFmY/iJRXAiyS5kmHm6bu9U1Zu3uj5h8xBLPE3V1ZopVsW7NN6edjLxWysTmlKhjFFS+rVoKai+acZRaCp4XGZEp1aE58ZRVSnH0h4mv8AEDSfvr8dOXD+ZLCV1wtzZmV9k4uentNGnzapyqP0vlt+IGE7O1oyvPGurH7MqMVr5p3KaXsU007Su+mpX2LjO7m6L3TvKPSSWvzS/BCr7BqSvatTjf8A6Un/AKyHDdmpReaeKnOe7NGOWy5atja6hvSxC5ge0oqw2Yl9eT8yVYFc2REjxKBeIQ3sYvZQF3qBcwvZ0P3QELkDcsKmhd2iiugkmWIwQeVEF1gtiEUCyNiEA44hAMIQgGHEIBwRCAVxIQgHExCAVxXEIBxmIQA3E2IRA2YeUhCKIJy1GuMIAoBiEASQbQhEH//Z"

const categories = [
    {
        id: "idukisod",
        name: "HIIT",
        imageUrl: catImg,
    },
    {
        id: "idukisoff",
        name: "Pilates",
        imageUrl: catImg,
    },
    {
        id: "idukishhod",
        name: "Yoga",
        imageUrl: catImg,
    },
    {
        id: "idukisohh",
        name: "Pole Dancing",
        imageUrl: catImg,
    },
    {
        id: "idukisojj",
        name: "Boxing",
        imageUrl: catImg,
    },
]

const CategoryPill = ({ category, onPress }) => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    const pillWidth = DEVICE_WIDTH / 3

    return (
        <TouchableOpacity onPress={onPress} style={{ margin: 10 }}>
            <View
                flexDirection="row"
                alignItems="center"
                backgroundColor="$gray6"
                borderRadius={5}
                width={150} // Set a fixed width for the pill
                paddingRight={5} // Optional: Add padding to the right
                flexWrap="wrap"
            >
                <Image
                    alignSelf="flex-start"
                    source={{ uri: category.imageUrl }}
                    style={{ width: 50, height: 40 }}
                />
                <Text marginLeft={5} wordWrap="break-word">
                    {category.name}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const Bookings = () => {
    const { isLoading, data: profile } = api.auth.getProfile.useQuery()
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    console.log({ profile })
    const router = useRouter()

    const goToUpcoming = () => {
        router.push("/bookings/upcoming")
    }

    const handleAvatarPress = () => {}

    const handleCategoryPress = (category) => {
        // Handle category press (e.g., navigate to a detailed view)
        console.log("Category pressed:", category)
    }

    return (
        <View flex={1} mt="$4"  width={DEVICE_WIDTH}>
            <XStack justifyContent="space-between" mb={15} alignItems="center" px={10}>
                <H2>Classes</H2>
                <View alignItems="center">
                    <TouchableOpacity onPress={goToUpcoming}>
                        <Ionicons name="calendar-outline" size={20} />
                    </TouchableOpacity>
                    <Text>Upcoming</Text>
                </View>
            </XStack>
            <Tabs
                defaultValue="By Date"
                flexDirection="column"
                
                mt="$2"
                width={DEVICE_WIDTH}
            >
                <Tabs.List
                    space={10}
                    mb="$2"
                    width={DEVICE_WIDTH}
                    disablePassBorderRadius="bottom"
                    separator={null}
                >
                    {tabs.map((tab) => (
                        <Tabs.Tab value={tab} key={tab}>
                            <SizableText fontSize={"$3"}>{tab}</SizableText>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                <Tabs.Content value="By Date" px={10} style={{width: DEVICE_WIDTH  }} >
                    <DateCalendarTabs onDatePress={() => {}} />
                    <ScrollView mt={20}  >
                            <Activity />
                            <Activity />
                    </ScrollView>
                  
                </Tabs.Content>
                <Tabs.Content value="By Instructor" px={10}>
                    <ScrollView>
                        <View flexDirection="row" flexWrap="wrap">
                            {avatars.map((avatar) => (
                                <AvatarItem
                                    key={avatar.id}
                                    avatar={avatar}
                                    onPress={() => handleAvatarPress(avatar)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </Tabs.Content>
                <Tabs.Content value="By Category" px={10}>
                    <ScrollView>
                        <View flexDirection="row" flexWrap="wrap">
                            {categories.map((category, i) => (
                                <CategoryPill
                                    key={category.id}
                                    category={category}
                                    onPress={() =>
                                        handleCategoryPress(category)
                                    }
                                />
                            ))}
                        </View>
                    </ScrollView>
                </Tabs.Content>
               
            </Tabs>
        </View>
    )
}

export default Bookings


const img = "https://as2.ftcdn.net/v2/jpg/05/59/11/71/1000_F_559117107_zXFRDsN7gq6jOS7HhNVWceDxCMTvKRM3.jpg"

const Activity = () => {
    return (
    
        <View mb={10}  px={20} py={15} borderRadius={8} backgroundColor={'white'}  style={{ elevation: 3}} >
            <XStack justifyContent="space-between" alignItems="flex-start" >
                <YStack>
                    <H6>Amber Wellness Yoya</H6>
                    <Text color="$gray9">Gym Studio,DIFC</Text>
                    <XStack mt={10} space={10}>
                        <XStack space={2} alignItems="center">
                            <Text>20</Text>
                            <Ionicons name="people-outline" size={15} />
                        </XStack>
                        <XStack  space={2} alignItems="center">
                           
                            <Ionicons name="time-outline" size={15} />
                            <Text>15:00pm</Text>
                        </XStack>
                      
                    </XStack>
                    <Text my={5} color="$red7">8 spots left</Text>
                  
                </YStack>
                <Image borderRadius={10} source={{ uri: img }} height={100} width={100} resizeMode="center" />
              
            </XStack>
            <XStack space={10} mt={20} alignItems="center">
                    <Button variant="outlined">Reserve</Button>
                    <Button bg="black" color="white">Reserve with friends</Button>
                   </XStack>
        </View>
        
    )
}
