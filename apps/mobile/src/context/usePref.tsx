import { createContext, useContext, useState, type ReactNode } from "react"

type PrefData = {
   fitness:  {
    [key: string]: any
   },
   dietary:  {
    [key: string]: any
   },
   wellness:  {
    [key: string]: any
   }
}

type PrefContextType = {
    data: PrefData
    update: (newData: Partial<PrefData>) => void
}

const prefContext = createContext<PrefContextType | undefined>(undefined)

type ProviderProps = {
    children: ReactNode
}

export function PrefProvider({ children }: ProviderProps) {
    const [data, setData] = useState({})

    const update = (newData: Partial<PrefData>) => {
        setData((prevData) => ({
            ...prevData,
            ...newData,
        }))
    }

    return (
        <prefContext.Provider value={{ data, update }}>
            {children}
        </prefContext.Provider>
    )
}

export function usePref() {
    const context = useContext(prefContext)
    if (context === undefined) {
        throw new Error(
            "usePref must be used within a usePref",
        )
    }
    return context
}
