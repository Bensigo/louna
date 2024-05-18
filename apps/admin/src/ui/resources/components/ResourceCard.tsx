
import { Box, Button, Divider, HStack, IconButton,  Stack, Tag, Text, useToast } from "@chakra-ui/react"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import { type RouterOutputs, api } from "~/utils/api";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";



type Resource = NonNullable<RouterOutputs['resource']['get'] & { image: { key: string, repo: string}}>
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource  }) => {
    const { id, title, url, image } = resource
    const { replace } = useRouter()
    const pathname  = usePathname()
    

    const toast = useToast()
    const { mutate: Delete, isLoading: isDeleteing } = api.resource.delete.useMutation()
    const ctx = api.useUtils()


    const handleDelete = () => {
        Delete({
            id 
        }, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: 'Resource Deleted',
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
            w={230}
           
        >
            <Box mb={2}>
            <Box w={230} h={180}>
                        <CustomImage
                            objectPosition={"top"}
                            src={buildFileUrlV2(
                                `${image?.repo}/${image.key}`,
                            )}
                            alt={`${name}`}
                            height={"100%"}
                            width={"100%"}
                        />
                    </Box>
                  <Divider />  
                <Stack py={3} px={4} spacing={2}>
                 
                    <Text wordBreak={'break-word'} fontSize={'medium'}>{title}</Text>
                    <HStack spacing={2}>
                    <Tag fontSize={'xs'} width={'fit-content'}  colorScheme={resource.isPublish ? 'green': 'red'}>{resource.isPublish ? 'visible': 'hidden'}</Tag>
                    <Tag fontSize={'xs'} width={'fit-content'}  colorScheme={'blue'}>{resource.contentType === 'Link' ? 'Article': resource.contentType}</Tag>
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

export { ResourceCard  }
