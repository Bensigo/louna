import { Flex, Button, Stack } from "@chakra-ui/react"

interface IPaginator {
    currentPage: number
    totalPages: number
    goToPage: (page: number) => void
}

const Paginator: React.FC<IPaginator> = (props) => {
    const { totalPages, currentPage, goToPage } = props
    return (
        <Flex  justify={'center'} width={'inherit'}  >
            <Stack direction={'row'} spacing={5}>
                <Button
                    mr={2}
                    bg="blackAlpha.900"
                    color={'whitesmoke'}
                    size={'sm'}
                    _hover={{
                        bg: 'blackAlpha.900',
                        color: 'whitesmoke'
                    }}
                    onClick={() => goToPage(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    Prev
                </Button>
                {[...Array(totalPages).keys()].map((page) => (
                    <Button
                        mr={1}
                        size={'sm'}
                
                        key={page + 1}
                        onClick={() => goToPage(page + 1)}
                        bg={currentPage === page + 1 ? "black" : "none"}
                        color={currentPage === page + 1 ? "white" : ""}
                    >
                        {page + 1}
                    </Button>
                ))}
                <Button
                    ml={2}
                    bg="blackAlpha.900"
                    size={'sm'}
                    color={'whitesmoke'}
                    _hover={{
                        bg: 'blackAlpha.900',
                        color: 'whitesmoke'
                    }}
                    onClick={() => goToPage(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Stack>
        </Flex>
    )
}

export { Paginator }
