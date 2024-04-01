import {
    Badge,
    Box,
    HStack,
    Text,
    Tooltip,
    Link,
    useToast,
    Button,
    IconButton,
} from "@chakra-ui/react"
import NextLink from "next/link"

import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { BiTrash } from "react-icons/bi"

interface Instructor {
    id: string
    bio: string
    imageKey: string
    title: string
    repo: string
    firstname: string
    lastname: string
    calenderUrl: string | null
    subCategories: string[]
    category: "Fitness" | "Wellness"
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const ExpertCard: React.FC<{ instructor: Instructor }> = ({
    instructor,
}) => {
    const {
        firstname,
        lastname,
        title,
        subCategories,
        category,
        imageKey,
        id,
        repo,
    } = instructor

    const pathname = usePathname()
    const { replace } = useRouter()
    const toast = useToast()
    const { mutate: Delete, isLoading: isDeleteing } = api.recipe.delete.useMutation()
    const ctx = api.useUtils()


    const handleDelete = () => {
        Delete({
            id 
        }, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: 'Recipe Deleted',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
               ctx.recipe.list.refetch()
            },
            onError: (err) => {
                
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }
        });
    }

    const goToDetail = () => {
      replace(`${pathname}/${id}`)
    } 

    return (
       

        <Box
            shadow="xs"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            maxW={250}
        >
            <Box mb={2}>
                <CustomImage
                    objectPosition={"top"}
                    src={buildFileUrlV2(`${repo}/${imageKey}`)}
                    alt={`${firstname} ${lastname}`}
                    height={"150px"}
                    width={"100%"}
                />
                <Box px={4} py={3}>
                    <HStack spacing={1} alignSelf={'center'}>
                    <Text fontWeight="bold">{`${firstname} ${lastname}`}</Text>
                    {true && (
                        <Tooltip label="Active" placement="top" hasArrow>
                            <Badge fontSize={'10px'} ml={2} colorScheme="green">
                                Active
                            </Badge>
                        </Tooltip>
                    )}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                        Title: {title}
                    </Text>
                    <Badge
                        colorScheme="orange"
                        borderRadius="md"
                        fontSize={"x-small"}
                        px={2}
                        py={1}
                    >
                       Category: {category}
                    </Badge>
                    <HStack mt={3} align="center" flexFlow={"wrap"} spacing={1}>
                        {subCategories.map((category, index) => (
                            <Badge
                                key={index}
                                colorScheme="green"
                                borderRadius="md"
                                fontSize={"x-small"}
                                px={2}
                                py={1}
                            >
                                {category}
                            </Badge>
                        ))}
                    </HStack>
                </Box>
            </Box>
            <Box my={2} px={4} display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
            <Button variant={'outline'} onClick={goToDetail} w={'80%'}>View</Button>
             <IconButton size={'sm'} isLoading={isDeleteing} onClick={handleDelete} icon={<BiTrash />} colorScheme="red" aria-label={"delete-btn"}/>
           </Box>
        </Box>
        
    )
}

export default ExpertCard
