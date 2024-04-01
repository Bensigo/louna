import { Box, Button, Divider, IconButton, Link, Stack, Text, useToast } from "@chakra-ui/react"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import { formatDistanceToNow } from 'date-fns';import { api } from "~/utils/api";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";


type SMW = {
    id:string
    title: string
    description: string
    thumbnailKey: string
    thumbnailRepo: string
    videoKey: string
    videoRepo: string
    category: "FItness" | "Wellness"
    createdAt: Date
    updatedAt: Date
}

const SMWCard: React.FC<{ smw: SMW , path?: string}> = ({ smw, path }) => {
    const { id, title, thumbnailKey, thumbnailRepo, createdAt } = smw
    const { replace } = useRouter()
    const pathname  = usePathname()
    
    const pastDate = new Date(createdAt);
    const formattedTimeAgo = formatDistanceToNow(pastDate, { addSuffix: true });

    const toast = useToast()
    const { mutate: Delete, isLoading: isDeleteing } = api.smw.delete.useMutation()
    const ctx = api.useUtils()


    const handleDelete = () => {
        Delete({
            id 
        }, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: 'SMW Deleted',
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
        if (path){    
            replace(path)
        }else {
            replace(`${pathname}/${id}`)
        }
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
                                `${thumbnailRepo}/${thumbnailKey}`,
                            )}
                            alt={`${title}`}
                            height={"100%"}
                            width={"100%"}
                        />
                    </Box>
                  <Divider />  
                <Stack py={3} px={4} spacing={2}>
                 
                    <Text wordBreak={'break-word'} fontSize={'medium'}>{title}</Text>
                    <Text fontSize={'xs'} color={'gray.600'}>{formattedTimeAgo}</Text>
                  
                </Stack>
            </Box>
            <Box my={2} px={4} display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
            <Button variant={'outline'} onClick={goToDetail} w={'80%'}>View</Button>
             <IconButton size={'sm'} isLoading={isDeleteing} onClick={handleDelete} icon={<BiTrash />} colorScheme="red" aria-label={"delete-btn"}/>
           </Box>
        </Box>
        
    )
}

export { SMWCard }
