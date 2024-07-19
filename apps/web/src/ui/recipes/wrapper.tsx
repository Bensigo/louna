import React from "react";
import { Box, Container, Flex, HStack, Skeleton, Text } from "@chakra-ui/react";
import { type RouterOutputs } from "@solu/api";
import { RecipeHeader } from "./components/header";
import RecipeCard from "./components/RecipeCard";

type Recipe = NonNullable<RouterOutputs["recipe"]["getRecipe"]>;

export const Wrapper: React.FC<{ recipes: Recipe[], searchName: string, onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ recipes, onChangeSearch, searchName }) => {
    return (
        <>
            <RecipeHeader onChangeSearch={onChangeSearch} searchName={searchName} />
            <Container maxW="container.xl" p={{ base: 4, md: 8 }}>
                <Flex alignItems="center" flexDirection="column">
                    <HStack
                        spacing={4}
                        flexWrap="wrap"
                        justifyContent={{ base: "center", md: "flex-start" }}
                        width="100%"
                    >
                        {recipes && recipes.map((recipe) => (
                            <Skeleton isLoaded={true} key={recipe.id}>
                                <RecipeCard recipe={recipe} />
                            </Skeleton>
                        ))}
                        {!recipes?.length && (
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="center"
                                py={5}
                                width="100%"
                            >
                                <Text>Recipe not found</Text>
                            </Box>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </>
    );
};
