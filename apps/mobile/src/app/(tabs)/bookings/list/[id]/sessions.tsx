import { router, useLocalSearchParams } from "expo-router"
import { View , Text, Button, XStack, YStack, Card, H5  } from "tamagui"
import { api } from "../../../../../utils/api"
import { useRef, useState , useEffect} from "react"
import { RefreshControl, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native"
import { format } from "date-fns"
import { useCustomTabbar } from "../../../../../context/useCustomTabbar"

const SessionsScreen = () => {
    const { id, date } = useLocalSearchParams()
    const [selectedSession, setSelectedSession] = useState(null)
    const sessionsRef = useRef()
    const { hideTabBar, showTabBar } = useCustomTabbar()

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [hideTabBar, showTabBar])

 

    const { data: partner, isLoading, isRefetching, refetch } = api.partner.get.useQuery({ id: id as string , date : new Date(date)})
    const { sessions } = partner || {}


    const { mutate, isLoading: isCreating } = api.booking.create.useMutation()

    const handleRefresh = () => {
        // Implement your refresh logic here
    }

    const renderItem = ({ item: session }) => {
        /* highlight selected session on press */
        const isSelected = selectedSession && selectedSession.id === session.id
      
        return (  
            <Card px="$3" py="$4" bg={isSelected ? '$gray4' : 'white'}>
                     <TouchableOpacity onPress={() => setSelectedSession(session)}>
                    <XStack gap={'$3'} alignItems="center">
                        <YStack gap="$2">
                            <H5 fontSize={"$5"}>{format(session.startTime, 'MMM d')}</H5>
                            <Text fontSize={'$2'}>{format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}</Text>
                        </YStack>
                        <YStack gap="$2">
                            <H5 fontSize={"$5"}>{session.title}</H5>
                            <XStack gap={'$2'}>
                                <Text fontSize={'$2'}>Points: {session.point}</Text>
                                <Text fontSize={'$2'}>Capacity: {session.capacity}</Text>
                            </XStack>
                        </YStack>
                    </XStack>
                </TouchableOpacity>
            </Card>
        )
    }


    const handleReserveSession = (id: string) => {
 
            // reserve a session
        mutate({
            id,
        }, {
            onError(err){
                Alert.alert("Error", err.message, [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        
                    }
                ])
            },
            onSuccess(){
                router.push('/bookings/upcoming')
            }
        })
       
    }

    return (
        <View flex={1} px={'$4'}>
            <FlatList
                ref={sessionsRef}
                data={sessions}
                ListEmptyComponent={() => <Text>No session available</Text>}
                onEndReached={handleRefresh}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}   
                maxToRenderPerBatch={10}
                initialScrollIndex={0}
                onEndReachedThreshold={0}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    sessionsRef.current?.scrollToOffset({
                        offset: index * averageItemLength,
                        animated: true,
                    })
                }}
                refreshControl={<RefreshControl
                    onRefresh={refetch}
                    refreshing={isRefetching}
                />}        
            />
            {sessions && sessions.length > 0 && (
                <Button onPress={() => handleReserveSession(selectedSession.id)} mx={'$3'} my={'$2'} bg={'black'}>
                    {isCreating && <ActivityIndicator size={'small'} />}
                    {!isCreating &&<Text color={'white'}>Reserve your spot {selectedSession && `(${selectedSession.point} ) credit`}</Text>}
                </Button>
            )}
        </View>
    )
}

export default SessionsScreen
