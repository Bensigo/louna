import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    TouchableOpacity,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import {
    Button,
    Card,
    H3,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
    XStack,
    YStack,
} from "tamagui"

import { useCustomTabbar } from "../../context/useCustomTabbar"
import { api } from "../../utils/api"
import { H4 } from "tamagui"

export type TopUp = {
    points: number
    price: number
    currency: "AED" | "USD"
}

// todo manage topup from admin
const topUps: TopUp[] = [
    {
        points: 85,
        price: 100.0,
        currency: "AED",
    },
    {
        points: 212,
        price: 250.0,
        currency: "AED",
    },
    {
        points: 340,
        price: 400.0,
        currency: "AED",
    },
]



const subscriptions = [
    {
        id: "1",
        amount: 1249.0,
        currency: "AED",
        bg: "black",
        color: 'white',
        plan: "Steller",
        desciption:
            "Unlock all of our features, and get the best experience as a Vip",
        features: [
            { description: "X solu tokens", available: true },
            { description: "Access to Solu Sundays (VVIP)", available: true },
            {
                description:
                    "Book up to 8 sessions / month (including fitness classes, therapy, etc.)",
                available: true,
            },
            { description: "Personalized Solu Recipes", available: true },
            {
                description: "Personalized Solu Micro Wellness",
                available: true,
            },
            {
                description: "Full access community engagement features",
                available: true,
            },
            {
                description:
                    "Bi-weekly newsletter with advanced health insights",
                available: true,
            },
            {
                description:
                    "Weekly one-on-one consultation with a Solu Expert",
                available: true,
            },
            {
                description: "Priority access to Solu events and webinars",
                available: true,
            },
            { description: "Verification badge on profile", available: true },
            { description: "Create private group", available: true },
            { description: "Monthly Solu Care Box", available: true },
            { description: "Access to partner communities", available: true },
        ],
    },
    {
        id: "2",
        amount: 749.0,
        currency: "AED",
        bg: "$green6",
        plan: "Premuim",
        desciption:
            "Unlock all of our features, and get the best experience as a Vip",
        features: [
            { description: "X solu tokens", available: true },
            { description: "Access to Solu Sundays (VIP)", available: true },
            {
                description:
                    "Book up to 5 sessions / month (including fitness classes, therapy, etc.)",
                available: true,
            },
            { description: "Personalized Solu Recipes", available: true },
            {
                description: "Personalized Solu Micro Wellness",
                available: true,
            },
            {
                description: "Full access community engagement features",
                available: true,
            },
            {
                description:
                    "Bi-weekly newsletter with advanced health insights",
                available: true,
            },
            {
                description:
                    "Monthly one-on-one consultation with a Solu Expert",
                available: true,
            },
            {
                description: "Priority access to Solu events and webinars",
                available: true,
            },
            { description: "Access to partner communities", available: true },
        ],
    },
    {
        id: "3",
        amount: 499.0,
        bg: "white",
        currency: "AED",
        plan: "Basic",
        desciption:
            "Have access to some of our amazing features to give you an amxzing expirence",
        features: [
            { description: "X solu tokens", available: true },
            { description: "Access to Solu Sundays (free)", available: true },
            {
                description:
                    "Book up to 4 sessions / month (including fitness classes, therapy, etc.)",
                available: true,
            },
            { description: "Personalized Solu Recipes", available: true },
            {
                description: "Personalized Solu Micro Wellness",
                available: true,
            },
            {
                description: "Full access community engagement features",
                available: true,
            },
            {
                description:
                    "Bi-weekly newsletter with advanced health insights",
                available: true,
            },
        ],
    },
]

type SubscriptionPlan = typeof subscriptions[0]
type  subscriptionType = "Basic" | "Premium" | "TopUp" | "Stellar"




/**
 * payment processs
 * 1. initiallize payment with pending status
 * 2. on after payment from applepay/andriod pay create payment log
 * 3. update payment status with the validated  payment  staus using payment log
 * 4. handle top up or subscription 
 */

const TopUpScreen = () => {
    const router = useRouter()
    const { hideTabBar, showTabBar } = useCustomTabbar()
    const [isLoading, setLoading] = useState(false)
    const { width: DEVICE_WIDTH } = useWindowDimensions()

    const { mutateAsync: createPayment } = api.payment.create.useMutation() // todo update when apple pay is integrated
    const { mutateAsync: creditWallet } = api.payment.creditWallet.useMutation()
     /*
    Input
    id: string;
    paymentId: string;
    metadata: Prisma.JsonValue;
    status: PaymentStatus;
    timestamp: Date;
 
     */
    const { mutate: createPaymentLog, isLoading: isCreatingLog } = api.payment.createLog.useMutation()

    /**
     * INPUT 
     *  id: string;
     *  status: "pending" | "success" | "failed" | "decline" | "expired";
    */
    const { mutate: updateStatus, isLoading: isUpdatingPaymentStatus } = api.payment.updateStatus.useMutation()
    
 
    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])

    const handleTopUp = async (
        paymentId: string,
        amount: number,
    ) => {
        creditWallet(
            { amount, paymentId, subscriptionType: "TopUp" },
            {
                onError(err) {
                    setLoading(false)
                    Alert.alert("Error", err.message, [
                        {
                            text: "Cancel",
                            style: "cancel",
                            onPress: () => console.log("Cancel Pressed"),
                        },
                    ])
                },
                onSuccess() {
                    setLoading(false)
                    Alert.alert("Success", "Payment Successfull", [
                        {
                            text: "Cancel",
                            style: "cancel",
                            onPress: () => console.log("Cancel Pressed"),
                        },
                    ])
                },
            },
        )
    }

   const handleCreditWallet = async (paymentId: string,
    amount: number, subscriptionType:subscriptionType ) => {
        try {
            await createPaymentLog({ id: paymentId, status: 'success', metadata: mockMeta });

        }catch (err: any){
            setLoading(false);
            Alert.alert("Error", err.message, [{ text: "OK" }]);
        }
    }

    const handleTopUpClick = async (topUp: TopUp) => {
        const paymentMethod: "applePay" | "andriodPay" | "web" =
            Platform.OS === "ios" ? "applePay" : "andriodPay"
        // Perform navigation or any other action when a top-up option is clicked
        // TODO: trigger apple pay and
        setLoading(true)
        await createPayment(
            { amount: topUp.price, paymentMethod, subscriptionType: "TopUp" },
            {
                onError(err) {
                    setLoading(false)
                    Alert.alert("Error", err.message, [
                        {
                            text: "Cancel",
                            style: "cancel",
                            onPress: () => console.log("Cancel Pressed"),
                        },
                    ])
                },
                onSuccess(data) {
                    // create apple payment, createpayment log
                    // on apple pay compelete update payment status 
                    // handle payment
                    handleTopUp(data.paymentId, data.amount)
                },
            },
        )
    }

    const handleSubscription = (subscription: SubscriptionPlan) => {
        console.log({ subscription })
    }

    return (
        <ScrollView>
            <View flex={1} px={"$4"}>
            <View px="auto">
                <H3>Top ups</H3>
            </View>
            {/* Render each top-up option */}
            <XStack gap={"$2"}>
                {topUps.map((topUp, index) => (
                    <Card
                        key={index}
                        py={"$6"}
                        px={"$3"}
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                    >
                        <TouchableOpacity
                            onPress={() => handleTopUpClick(topUp)}
                        >
                            <YStack gap="$1" alignItems="center">
                                <Ionicons
                                    name="gift-outline"
                                    size={30}
                                    color="black"
                                />
                                <Text>{topUp.points} points</Text>
                                <Text>
                                    {topUp.price} {topUp.currency}
                                </Text>
                                {isLoading && (
                                    <ActivityIndicator size={"small"} />
                                )}
                            </YStack>
                        </TouchableOpacity>
                    </Card>
                ))}
            </XStack>
            <View  px="auto" mt={"$3"}>
                <H3>Plans</H3>
                <YStack gap={'$3'}>
                <FlatList
                    data={subscriptions}
                    keyExtractor={({ id }) => id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({ item: subscription }) => (
                        <Card
                            width={DEVICE_WIDTH / 1.1}
                            bg={subscription.bg}
                        
                            mr={"$2"}
                            py={"$6"}
                            px={"$4"}
                            justifyContent="center"
                            alignContent="center"
                            alignItems="center"
                        >
                            <YStack gap="$2" >
                                <Ionicons
                                    name="gift-outline"
                                    size={30}
                                    color="black"
                                />
                                <H3 color={subscription?.color || 'black'}>{subscription.plan}</H3>
                                <Text color={subscription?.color || 'black'}>
                                    {subscription.desciption} {""}
                                </Text>
                             

                                <Button onPress={() => handleSubscription(subscription)}>
                                    Upgrade to (
                                    {`${subscription.amount} ${subscription.currency}`}
                                    )
                                </Button>
                            </YStack>
                        </Card>
                    )}
                />
                 <H4>Plans details</H4>
                <FlatList
                    data={subscriptions}
                    keyExtractor={({ id }) => id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({ item: subscription }) => (
                        <Card
                            width={DEVICE_WIDTH / 1.1}
                            bg={subscription.bg}
                            mr={"$2"}
                            py={"$6"}
                            px={"$4"}
                         
                        >
                            <YStack gap="$2" px={'$3'}>
                            
                                <H3 color={subscription?.color ?? 'black'}>{subscription.plan}</H3>
                            
                                <Text color={subscription?.color ?? 'black'} fontSize={'$4'} fontWeight={'bold'}>
                                    Features
                                </Text>
                                {subscription.features.map(
                                    (feature, fIndex) => (
                                        <View
                                            key={fIndex}
                                            style={{
                                                flexDirection: "row",
                                               
                                            }}
                                        >
                                            <Ionicons
                                                name={
                                                    feature.available
                                                        ? "checkmark-circle"
                                                        : "close-circle"
                                                }
                                                size={20}
                                                color={
                                                    feature.available
                                                        ? "green"
                                                        : "red"
                                                }
                                                style={{ marginRight: 10 }}
                                            />
                                            <Text color={subscription?.color || 'black'} maxWidth={'90%'} wordWrap="break-word">{feature.description}</Text>
                                        </View>
                                    ),
                                )}
                            </YStack>
                        </Card>
                    )}
                />
                </YStack>
            </View>
        </View>
        </ScrollView>
    )
}

export default TopUpScreen


