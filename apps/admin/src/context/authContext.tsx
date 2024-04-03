import React, { useEffect, useMemo, useState } from "react"
import { useSession } from "@clerk/nextjs"

import { api, type RouterOutputs } from "~/utils/api"

export enum UserRole {
    INSTRUCTOR = "INSTRUCTOR",
    USER = "USER",
    ADMIN = "ADMIN",
    BUSINESS = "BUSINESS",
}

type UserData = RouterOutputs["user"]["get"]

const AuthContext = React.createContext<Context | null>(null)

const Provider = ({ children }: any) => {
    const { isSignedIn, isLoaded } = useSession()
    const { data, isFetched } = api.profile.get.useQuery()

    const [isAdmin, setIsAdmin] = useState(false)
    const [hasSetup, setHasSetup] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isFetched && isLoaded) {
            setIsLoading(false)
            if (isSignedIn && data) {
                const { roles, metadata } = data
                const isAdmin = roles.includes(UserRole.ADMIN)
                const hasSetup = (metadata?.hasSetup as boolean) || false
                setIsAdmin(isAdmin)
                setHasSetup(hasSetup)
            }
        }
    }, [data, isSignedIn, isFetched, isLoaded])

    const contextValue = useMemo(
        () => ({
            user: data,
            isSignedIn,
            isAdmin,
            hasSetup,
            isLoading,
        }),
        [data, isSignedIn, isAdmin, hasSetup, isLoading],
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const  AuthProvider = React.memo(Provider)

type Context = {
    isSignedIn: boolean | undefined
    user: UserData | null
    isAdmin: boolean
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
