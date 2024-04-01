import { Box, Button, Divider, HStack, IconButton, Link, Stack, Tag, Text, useToast } from "@chakra-ui/react"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import { api } from "~/utils/api";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";


type Partner = {
    id:string
    name: string
    bio: string
    amenities: string[]
    isPublished: boolean
    category: "FItness" | "Wellness",
    images: {key: string, repo: string }[]
    createdAt: Date
    updatedAt: Date
}

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner,  }) => {
    const { id, name, category, images } = partner
    const { replace } = useRouter()
    const pathname  = usePathname()
    

    const toast = useToast()
    const { mutate: Delete, isLoading: isDeleteing } = api.partner.delete.useMutation()
    const ctx = api.useUtils()


    const handleDelete = () => {
        Delete({
            id 
        }, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: 'Partner Deleted',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
               ctx.partner.list.refetch()
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
           
        >
            <Box mb={2}>
            <Box w={250} h={180}>
                        <CustomImage
                            objectPosition={"top"}
                            src={buildFileUrlV2(
                                `${images[0]?.repo}/${images[0]?.key}`,
                            )}
                            alt={`${name}`}
                            height={"100%"}
                            width={"100%"}
                        />
                    </Box>
                  <Divider />  
                <Stack py={3} px={4} spacing={2}>
                 
                    <Text wordBreak={'break-word'} fontSize={'medium'}>{name}</Text>
                    <HStack spacing={2}>

                    <Tag fontSize={'xs'} width={'fit-content'}  colorScheme="blue">{category}</Tag>
                    <Tag fontSize={'xs'} width={'fit-content'}  colorScheme={partner.isPublished ? 'green': 'red'}>{partner.isPublished ? 'visible': 'hidden'}</Tag>
                    </HStack>
                  
                </Stack>
            </Box>
            <Box my={2} px={4} display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
            <Button variant={'outline'} onClick={goToDetail} w={'80%'}>View</Button>
             <IconButton size={'sm'} isLoading={isDeleteing} onClick={handleDelete} icon={<BiTrash />} colorScheme="red" aria-label={"delete-btn"}/>
           </Box>
        </Box>
        
    )
}

export { PartnerCard }
