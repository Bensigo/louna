import { createContext, useContext, useState, type ReactNode } from "react"

type RecipePrefData = {
    [key: string]: unknown
}

type RecipePrefContextType = {
    recipePrefData: RecipePrefData
    updateRecipePrefData: (newData: Partial<RecipePrefData>) => void
}
const recipePrefContext = createContext<RecipePrefContextType | undefined>(undefined)

type ProviderProps = {
    children: ReactNode
}

export function RecipePrefProvider({ children }: ProviderProps) {
    const [recipePrefData, setRecipePrefData] = useState({})

    const updateRecipePrefData = (newData: Partial<RecipePrefData>) => {
        setRecipePrefData((prevData) => ({
            ...prevData,
            ...newData,
        }))
    }

    return (
        <recipePrefContext.Provider value={{ recipePrefData, updateRecipePrefData }}>
        {children}
    </recipePrefContext.Provider>
    )
}

export function useRecipePref() {
    const context = useContext(recipePrefContext)
    if (context === undefined) {
        throw new Error("useRecipePref must be used within a RecipePrefProvider")
    }
    return context
}
