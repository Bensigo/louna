import { createContext, useContext, useState, type ReactNode } from "react"

type SurveyData = {
    [key: string]: unknown
}

type SurveyContextType = {
    surveyData: SurveyData
    updateSurveyData: (newData: Partial<SurveyData>) => void
}
const surveyContext = createContext<SurveyContextType | undefined>(undefined)

type SurveyProviderProps = {
    children: ReactNode
}

export function SuveryProvider({ children }: SurveyProviderProps) {
    const [surveyData, setSurveyData] = useState({})

    const updateSurveyData = (newData: Partial<SurveyData>) => {
        setSurveyData((prevData) => ({
            ...prevData,
            ...newData,
        }))
    }

    return (
        <surveyContext.Provider value={{ surveyData, updateSurveyData }}>
            {children}
        </surveyContext.Provider>
    )
}

export function useSurvey() {
    const context = useContext(surveyContext)
    if (context === undefined) {
        throw new Error("useSurvey must be used within a SurveyProvider")
    }
    return context
}
