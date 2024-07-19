import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter, type RouterOutputs } from "@solu/api";
import { prisma } from "@solu/db";
import { api } from "~/utils/api";
import { LIMIT } from "~/utils/config";
import Footer from "~/components/Footer";
import SEO from "~/components/SEO";
import { Box, Container, Flex, HStack, Skeleton, Text } from "@chakra-ui/react";
import { Paginator } from "~/components/Paginator";
import { useDebouncedCallback } from "use-debounce";
import { type Filters, RecipeHeader } from "~/ui/recipes/components/header";
import RecipeCard from "~/ui/recipes/components/RecipeCard";



export type Recipe = NonNullable<RouterOutputs["recipe"]["getRecipe"]>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const page = parseInt(query.page as string) || 1;
  const mealType = query.mealType ? query.mealType.split(',') : [];
  const dietType = query.dietType ? query.dietType.split(',') : [];
  const difficulty = query.difficulty ? query.difficulty.split(',') : [];
  const searchName = (query.searchName as string) || "";

  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      headers: {
        'x-secret': process.env.X_SECRET
      }
    },
    transformer: superjson,
  });

  const { recipes, totalCount } = await helper.recipe.list.fetch({
    filter: {
      mealType,
      dietType,
      difficulty,
    },
    searchName,
    skip: (page - 1) * LIMIT,
    limit: LIMIT,
  });

  const serializedRecipes = recipes.map((recipe) => ({
    ...recipe,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    likes: recipe.likes.map((like) => ({
      ...like,
      createdAt: like.createdAt.toISOString(),
      updatedAt: like.updatedAt.toISOString(),
    })),
  }));

  const totalPages = Math.ceil(totalCount / LIMIT);

  const seoData = {
    title: `Recipes - Page ${page}`,
    description: `A list of delicious recipes for ${mealType.join(', ').toLowerCase()} meals. Page ${page}.`,
    keywords: `recipes, food, cooking, ${mealType.join(', ').toLowerCase()}, page ${page}`,
    author: "Your Website",
    ogTitle: `Recipes for ${mealType.join(', ')}`,
    ogDescription: `Discover our best recipes for ${mealType.join(', ').toLowerCase()}.`,
    ogImage: "https://example.com/default-recipe-image.jpg",
    ogUrl: `https://example.com/recipes?page=${page}&mealType=${mealType.join(',')}&dietType=${dietType.join(',')}&difficulty=${difficulty.join(',')}&searchName=${searchName}`,
    twitterCard: "summary_large_image",
    twitterTitle: `Recipes for ${mealType.join(', ')}`,
    twitterDescription: `Find the best recipes for ${mealType.join(', ').toLowerCase()}.`,
    twitterImage: "https://example.com/default-recipe-image.jpg",
    twitterSite: "@yourwebsite",
  };

  return {
    props: {
      initialRecipes: serializedRecipes,
      page,
      mealType,
      dietType,
      difficulty,
      searchName,
      seoData,
      totalPages,
    },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Recipes: React.FC<Props> = ({ initialRecipes, page, mealType, dietType, difficulty, searchName, seoData, totalPages }) => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentMealType, setCurrentMealType] = useState(mealType);
  const [currentDietType, setCurrentDietType] = useState(dietType);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [currentSearchName, setCurrentSearchName] = useState(searchName);
  const [isLoading, setIsLoading] = useState(false);

  const { data, refetch } = api.recipe.list.useQuery(
    {
      filter: {
        mealType: currentMealType,
        dietType: currentDietType,
        difficulty: currentDifficulty,
        skip: (currentPage - 1) * LIMIT,
        limit: LIMIT,
      },
      searchName: currentSearchName,
    },
    { keepPreviousData: true, enabled: false } // Disable fetching on mount
  );

  useEffect(() => {
    if (data?.recipes) {
      setRecipes(data.recipes);
    }
  }, [data]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    router.push({
      pathname: "/recipes",
      query: {
        page,
        mealType: currentMealType.join(','),
        dietType: currentDietType.join(','),
        difficulty: currentDifficulty.join(','),
        searchName: currentSearchName,
      },
    }, undefined, { shallow: true });
    refetch();
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    router.push({
      pathname: "/recipes",
      query: {
        page,
        mealType: currentMealType.join(','),
        dietType: currentDietType.join(','),
        difficulty: currentDifficulty.join(','),
        searchName: term,
      },
    }, undefined, { shallow: true });
    refetch();
  }, 300);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setCurrentSearchName(term);
    handleSearch(term);
  };

  const handleApplyFilters = (filters: Filters, closeDrawer: () => void) => {
    setCurrentMealType(filters.mealType);
    setCurrentDietType(filters.dietType);
    setCurrentDifficulty(filters.difficulty);
    setIsLoading(true);
    router.push({
      pathname: "/recipes",
      query: {
        page: 1,
        mealType: filters.mealType.join(','),
        dietType: filters.dietType.join(','),
        difficulty: filters.difficulty.join(','),
        searchName: currentSearchName,
      },
    }, undefined, { shallow: true }).then(() => {
      refetch().finally(() => {
        setIsLoading(false);
        closeDrawer();
      });
    });
  };

  return (
    <>
      <SEO {...seoData} />
      <RecipeHeader
        onChangeSearch={handleTextChange}
        searchName={currentSearchName}
        onApplyFilters={handleApplyFilters}
        isLoading={isLoading}
      />
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
      <Container py={10}>
        <Paginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
      </Container>
      <Footer />
    </>
  );
};

export default Recipes;
