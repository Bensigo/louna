import { FlatList } from "react-native"
import {
    Card,
    CardBackground,
    CardFooter,
    H4,
    H5,
    Image,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

const mockWorkoutData: WorkoutPropType[] = [
    {
        id: "1",
        name: "Yoga",
        duration: "20-30 mins",
        path: require("../../../assets/yoga-woman.jpg"),
    },
    {
        id: "2",
        name: "Pilate",
        duration: "20-30 mins",
        path: require("../../../assets/yoga-woman.jpg"),
    },
    {
        id: "4",
        name: "Cardio",
        duration: "20-30 mins",
        path: require("../../../assets/yoga-woman.jpg"),
    },
    {
        id: "5",
        name: "Upper Body",
        duration: "20-30 mins",
        path: require("../../../assets/yoga-woman.jpg"),
    },
]

const mockCategories: WorkoutCategoryProps[] = [
    {
        id: "1",
        name: "Cardio",
        url: require("../../../assets/workout-c.jpg"),
    },
    {
        id: "2",
        name: "Abs",
        url: require("../../../assets/workout-c.jpg"),
    },
    {
        id: "3",
        name: "Beciep",
        url: require("../../../assets/workout-c.jpg"),
    },
    {
        id: "4",
        name: "Chest",
        url: require("../../../assets/workout-c.jpg"),
    },
    {
        id: "5",
        name: "Legs",
        url: require("../../../assets/workout-c.jpg"),
    },
]

const WorkOutView = () => {
    return (
        <View mt="$4">
            <H5 mb="$2">New Workouts</H5>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={mockWorkoutData}
                style={{
                    paddingVertical: 10,
                    backgroundColor: "inherit",
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkoutCard {...item} />}
            />
            <View mt="$4">
                <H5 mb="$4">Categroies</H5>

                <FlatList
                    scrollEnabled
                    keyExtractor={(item) => item.id}
                    data={mockCategories}
                    renderItem={({ item }) => <WorkoutCategory {...item} />}
                />
            </View>
        </View>
    )
}

export { WorkOutView }

type WorkoutPropType = {
    id: string
    name: string
    path: any
    duration: string
}

const WorkoutCard = (props: WorkoutPropType) => {
    return (
        <Card
            mr="$2"
            minHeight={280}
            minWidth={250}
            bg={"black"}
            elevate
            size={"$3"}
        >
            <CardBackground>
                <Image
                    resizeMode="cover"
                    alt="workout-card"
                    alignSelf="center"
                    blurRadius={4}
                    source={{
                        uri: props.path,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </CardBackground>
            <CardFooter padded>
                <YStack>
                    <H5 color={"white"} fontWeight={"$13"}>
                        {props.name}
                    </H5>
                    <Text color={"white"} fontWeight={"$10"}>
                        {props.duration}
                    </Text>
                </YStack>
                <XStack flex={1} />
            </CardFooter>
        </Card>
    )
}

type WorkoutCategoryProps = {
    name: string
    url: any
    id: string
}

const WorkoutCategory = (props: WorkoutCategoryProps) => {
    return (
        <Card
            minHeight={150}
            mt="$1.5"
            justifyContent="center"
            alignItems="center"
        >
            <CardBackground>
                <Image
                    resizeMode="cover"
                    alt="workout-card"
                    alignSelf="center"
                    blurRadius={4}
                    source={{
                        uri: props.url,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </CardBackground>
            <H4 color={"white"} fontWeight={"$13"}>
                {props.name}
            </H4>
        </Card>
    )
}
