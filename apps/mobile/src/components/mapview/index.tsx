import React from "react"
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import MapView from "react-native-maps"

const MapWithInfo = ({
    latitude,
    longitude,
    info,
}: {
    latitude: string
    longitude: string
    info: string
}) => {
    const openMapApp = () => {
        const url = `http://maps.apple.com/?ll=${latitude},${longitude}`
        Linking.openURL(url)
    }

    return (
        <TouchableOpacity style={styles.container} onPress={openMapApp}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>{info}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        height: 150,
    },
    infoContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 10,
        borderRadius: 5,

        marginBottom: 16,
        alignItems: "center",
    },
    infoText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
})

export default MapWithInfo
