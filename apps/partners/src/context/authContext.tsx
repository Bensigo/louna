import React, { useState } from "react"
import { useSession } from "@clerk/nextjs"

import { api } from "~/utils/api"

export enum UserRole {
    INSTRUCTOR = "INSTRUCTOR",
    USER = "USER",
    ADMIN = "ADMIN",
    BUSINESS = "BUSINESS",
}

type UserData = {
    // Define the structure of your user data
    firstname: string | null
    lastname: string | null
    wallet: any
    email: string
    imageUrl: string | null
    birthdate: Date | null
    roles: UserRole[]
    metadata?: any
}

const AuthContext = React.createContext<Context | null>(null)

export const AuthProvider = ({ children }: any) => {
    const { isSignedIn, isLoaded } = useSession()
    const { data, isFetched } = api.profile.get.useQuery()

    const [isInstructor, setIsInstructor] = useState(false)
    const [hasSetup, setHasSetup] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        if (isSignedIn && isFetched && data && isLoaded) {
            if ("roles" in data && "metadata" in data) {
                const roles = data.roles as string[] // Cast to string[] if not already inferred
                const metadata = data.metadata as { hasSetup?: boolean }
                setHasSetup(!!metadata?.hasSetup)

                setIsInstructor(!!roles.includes("INSTRUCTOR"))
            }
            setIsLoading(false)
        }

        if(isFetched && isLoaded && !isSignedIn){
            setIsLoading(false)
        }

    }, [data, isSignedIn, isFetched, isLoaded])

    const contextValue = {
        user: data,
        isSignedIn,
        isInstructor,
        hasSetup,
        isLoading,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

type Context = {
    isSignedIn: boolean | undefined
    user: UserData | null
    isInstructor: boolean
    hasSetup: boolean
    isLoading: boolean
}

export const useCustomAuth = () => {
    const context = React.useContext<Context | null>(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}
