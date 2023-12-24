import { useAuth } from "@clerk/clerk-expo"
import { Button, View } from "tamagui"

const Profile = () => {
    const { signOut } = useAuth()

    const handleLogout = () => {
        signOut()
    }
    return (
        <View flex={1} justifyContent="center">
            <Button
                backgroundColor={"black"}
                color={"white"}
                onPress={handleLogout}
            >
                Logout
            </Button>
        </View>
    )
}

export default Profile
