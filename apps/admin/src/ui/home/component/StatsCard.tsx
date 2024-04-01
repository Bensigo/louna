import {
    Box,
    HStack,
    Icon,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
    Tooltip,
} from "@chakra-ui/react"
import { BiInfoCircle } from "react-icons/bi"

type StatsCardType = {
    name: string
    value: number
    helpText: string
}

export const StatsCard: React.FC<StatsCardType> = ({
    name,
    value,
    helpText,
}) => {
    return (
        <Box
            borderWidth={1}
            alignContent={"center"}
            display={"flex"}
            justifySelf={"center"}
            borderRadius={"md"}
            boxShadow={"sm"}
            minW={200}
            py={3}
            px={5}
        >
            <Stat>
                <StatLabel>{name}</StatLabel>

                <StatNumber>
                    <StatArrow type="increase" />
                    {value}
                </StatNumber>
                <HStack spacing={3} align={'center'}>
                    <BiInfoCircle size={12} />
                    <StatHelpText fontSize={12}>{helpText}</StatHelpText>
                </HStack>
            </Stat>
        </Box>
    )
}
