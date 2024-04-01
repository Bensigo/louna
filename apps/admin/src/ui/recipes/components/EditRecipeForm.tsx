import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Skeleton,
    Stack,
    Tag,
    Textarea,
    useToast,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { BiArrowBack, BiPlus, BiTrash } from "react-icons/bi"
import { z } from "zod"

import { api } from "~/utils/api"
import { MemoV2FileUplaod } from "~/shared/V2FileUpload"
import { RecipeFormSchema, type RecipeFormType } from "../schema/recipe"

export const categories = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Snack",
    "Appetizer",
    "Dessert",
    "Beverage",
    "Salad",
    "Soup",
    "Side Dish",
    "Main Course",
    "Cocktail",
    "Smoothie",
    "Bread",
    "Pasta",
    "Pizza",
    "Sandwich",
    "Burger",
    "Stew",
    "Grill",
    "BBQ",
    "Sushi",
    "Curry",
    "Rice",
    "Noodle",
    "Seafood",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Low-Carb",
    "High-Protein",
    "Low-Calorie",
    "Keto",
    "Paleo",
    "Whole30",
    "Weight Loss",
    "Healthy",
    "Comfort Food",
    "Quick & Easy",
    "Budget-Friendly",
    "Family-Friendly",
    "Meal Prep",
    "Date Night",
    "Holiday",
    "Celebration",
    "Picnic",
    "Potluck",
    "Game Day",
    "Cookout",
    "Summer",
    "Fall",
    "Winter",
    "Spring"
  ];
  
  

export const tags = [
    "quick",
    "simple",
    "affordable",
    "meal prep",
    "family-friendly",
    "1 with a snack",
    "2 with a snack",
    "3 with a snack",
    "more than 3",
]

export enum CuisineType {
    ITALIAN = "ITALIAN",
    MEXICAN = "Mexican",
    CHINESE = "MEXICAN",
    INDIAN = "INDIAN",
    FRENCH = "FRENCH",
    JAPANESE = "JAPANESE",
    THAI = "THAI",
    AMERICAN = "AMERICAN",
    MEDITERRANEAN = "MEDITERRANEAN",
    AFRICAN = 'AFRICAN',
    OTHER = "OTHER",
}

const EditForm = ({ recipe, id }) => {
    const toast = useToast()
    const router = useRouter()
    // const { mutate: editRecipe, isLoading  } = api.recipe..useMutation()

    const goBack = () => router.replace(`/dashboard/recipes/${id}`)

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
    } = useForm<RecipeFormType>({
        resolver: zodResolver(RecipeFormSchema),
        defaultValues: {
            ...recipe,
            steps: recipe.steps.map((step) => ({ value: step })),
            ingredients: recipe.ingredients,
        },
    })

    const selectedCategories = useWatch({ name: "categories", control }) || []
    const selectedTags = useWatch({ name: "tags", control }) || []

    const {
        fields: stepFields,
        append: appendStep,
        remove: removeStep,
    } = useFieldArray({
        control,
        name: "steps",
    })

    const {
        fields: nutrientFields,
        append: appendNutrient,
        remove: removeNutrient,
    } = useFieldArray({
        control,
        name: "nutrients",
    })

    const {
        fields: ingredientFields,
        append: appendIngredient,
        remove: removeIngredient,
        update: updateIngredient,
    } = useFieldArray({
        control,
        name: "ingredients",
    })

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
        update: updateImage,
    } = useFieldArray({
        name: "images",
        control,
    })

    const { mutate: update, isLoading: isUpdating } =
        api.recipe.update.useMutation()

    const submitRecipe = (data: RecipeFormType) => {
        // Handle form submission logic
        const images = data.images.filter(
            (image) => !!image?.key && !!image?.repo,
        )
        update(
            { ...data, id: recipe.id, images },
            {
                onSuccess: () => {
                    toast({
                        title: "Updated",
                        description: "Recipe Updated",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    router.replace(`/dashboard/recipes/${recipe.id}`)
                },
                onError: (err) => {
                    toast({
                        title: "Error",
                        description: err.errors[0].longMessage,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                },
            },
        )
    }

    const handleAddNewIngredientImage = React.useCallback(
        (key: string, index: number) => {
            const ingredents = getValues("ingredients")
            const data = {
                name: ingredents[index]?.name as string,
                image: { key, repo: "ingredients" },
            }
            // setValue(`ingredients.${index}`, data)
            updateIngredient(index, data)
        },
        [updateIngredient],
    )

    const toggleCategory = (category: string) => {
        const currentCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category]
        setValue("categories", currentCategories)
    }

    const toggleTags= (tag: string) => {
        const currentTags = selectedTags.includes(tag)
            ? selectedTags.filter((c) => c !== tag)
            : [...selectedTags, tag]
        setValue("tags", currentTags)
    }

    const handleRemoveIngriedentImg = React.useCallback(
        (file: string, index: number) => {
            // setValue(`ingredients.${index}.image`, { });
            const ingredents = getValues("ingredients")
            // ingredents[index] = { name: ingredents[index]?.name }
            updateIngredient(index, { name: ingredents[index]?.name })
        },
        [updateIngredient, getValues],
    )

    const handleAddImage = (key: string, index: number) => {
        updateImage(index, { key, repo: "recipes" })
    }

    return (
        <>
            <Button leftIcon={<BiArrowBack />} onClick={goBack}>
                Back
            </Button>
            <Heading>Edit recipe</Heading>
            {recipe && (
                <Box p={4} maxW="xl">
                    <form onSubmit={handleSubmit(submitRecipe)}>
                        <Stack
                            direction={"row"}
                            spacing={5}
                            alignItems={"center"}
                        >
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>
                                <Input {...register("name")} />
                                <FormErrorMessage>
                                    {errors.name?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.contentType}>
                                <FormLabel>Content type</FormLabel>
                                <Select
                                    placeholder="Select content type"
                                    {...register("contentType")}
                                >
                                    <option value="Freemium">Freemium</option>
                                    <option value="Premium">Premium</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.contentType?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <Stack direction={"row"}>
                            <FormControl mt={4} isInvalid={!!errors.duration}>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <NumberInput min={0}>
                                    <NumberInputField
                                        {...register("duration")}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.duration?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!errors.calories}>
                                <FormLabel>Calories</FormLabel>
                                {/* <Input type="number"  /> */}
                                <NumberInput>
                                    <NumberInputField
                                        {...register("calories")}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.calories?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <Stack direction={"row"} spacing={5}>
                            <FormControl mt={4} isInvalid={!!errors.mealType}>
                                <FormLabel>Meal type</FormLabel>
                                <Select
                                    placeholder="Select meal type"
                                    {...register("mealType")}
                                >
                                    <option value="BREAKFAST">Breakfast</option>
                                    <option value="LUNCH">Lunch</option>
                                    <option value="DINNER">Dinner</option>
                                    <option value="SNACK">Snack</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.mealType?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mt={4} isInvalid={!!errors.dietType}>
                                <FormLabel>Diet Type</FormLabel>
                                <Select
                                    placeholder="Select Diet Type"
                                    {...register("dietType")}
                                >
                                    <option value="Standard">Standard</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Paleo">Paleo</option>
                                    <option value="Pescetarian">
                                        Pescetarian
                                    </option>
                                    <option value="Vegetarian">
                                        Vegetarian
                                    </option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.dietType?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <Stack direction={"row"} spacing={5}>
                            <FormControl
                                mt={4}
                                isInvalid={!!errors.difficultyLevel}
                            >
                                <FormLabel>Difficulty Level</FormLabel>
                                <Select
                                    placeholder="Select Difficulty Level"
                                    {...register("difficultyLevel")}
                                >
                                    <option value="EASY">EASY</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HARD">HARD</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.difficultyLevel?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl
                                mt={4}
                                isInvalid={!!errors.cusineType}
                            >
                                <FormLabel>Cuisine Type</FormLabel>
                                <Select
                                    placeholder="Select Cuisine Type"
                                    {...register("cusineType")}
                                >
                                    <option value={CuisineType.ITALIAN}>
                                        Italian
                                    </option>
                                    <option value={CuisineType.MEXICAN}>
                                        Mexican
                                    </option>
                                    <option value={CuisineType.CHINESE}>
                                        Chinese
                                    </option>
                                    <option value={CuisineType.INDIAN}>
                                        Indian
                                    </option>
                                    <option value={CuisineType.FRENCH}>
                                        French
                                    </option>
                                    <option value={CuisineType.JAPANESE}>
                                        Japanese
                                    </option>
                                    <option value={CuisineType.THAI}>
                                        Thai
                                    </option>
                                    <option value={CuisineType.AMERICAN}>
                                        American
                                    </option>
                                    <option value={CuisineType.AFRICAN}>
                                        African
                                    </option>
                                    <option value={CuisineType.MEDITERRANEAN}>
                                        Mediterranean
                                    </option>
                                    <option value={CuisineType.OTHER}>
                                        Other
                                    </option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.cusineType?.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <FormControl mt={4} isInvalid={!!errors.categories}>
                            <FormLabel>Categories</FormLabel>
                            <Stack spacing={2} direction="row" flexWrap="wrap">
                                {categories.map((category) => (
                                    <Tag
                                        key={category}
                                        size="lg"
                                        variant="solid"
                                        colorScheme={
                                            selectedCategories.includes(
                                                category,
                                            )
                                                ? "green"
                                                : "gray"
                                        }
                                        cursor="pointer"
                                        onClick={() => toggleCategory(category)}
                                    >
                                        {category}
                                    </Tag>
                                ))}
                            </Stack>
                            <FormErrorMessage>
                                {errors.categories?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.tags}>
                            <FormLabel>Tags</FormLabel>
                            <Stack spacing={2} direction="row" flexWrap="wrap">
                                {tags.map((tag) => (
                                    <Tag
                                        key={tag}
                                        size="lg"
                                        variant="solid"
                                        colorScheme={
                                            selectedTags.includes(
                                                tag,
                                            )
                                                ? "green"
                                                : "gray"
                                        }
                                        cursor="pointer"
                                        onClick={() => toggleTags(tag)}
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </Stack>
                            <FormErrorMessage>
                                {errors.tags?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.description}>
                            <FormLabel>Description</FormLabel>
                            <Textarea {...register("description")} />
                            <FormErrorMessage>
                                {errors.description?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.steps}>
                            <FormLabel>Steps</FormLabel>
                            {stepFields.map((step, index) => (
                                <Stack
                                    key={step.id}
                                    direction="row"
                                    mt={4}
                                    spacing={2}
                                    alignItems={"center"}
                                >
                                    <Textarea
                                        {...register(
                                            `steps.${index}.value` as const,
                                        )}
                                        defaultValue={step.value}
                                    />
                                    <IconButton
                                        aria-label="remove"
                                        icon={<BiTrash />}
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        colorScheme="red"
                                        size="sm"
                                    />
                                </Stack>
                            ))}
                            <Button
                                mt={5}
                                type="button"
                                rightIcon={<BiPlus />}
                                onClick={() => appendStep({ value: "" })}
                                colorScheme="green"
                                size="sm"
                            >
                                Add Step
                            </Button>
                            <FormErrorMessage>
                                {errors.steps?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.nutrients}>
                            <FormLabel>Nutrients</FormLabel>
                            {nutrientFields.map((nutrient, index) => (
                                <Stack
                                    key={nutrient.id}
                                    direction="row"
                                    spacing={2}
                                    alignItems={"center"}
                                >
                                    <Input
                                        placeholder="Name"
                                        {...register(
                                            `nutrients.${index}.name` as const,
                                        )}
                                        defaultValue={nutrient.name}
                                    />
                                    <Input
                                        placeholder="Value"
                                        {...register(
                                            `nutrients.${index}.value` as const,
                                        )}
                                        defaultValue={nutrient.value}
                                    />
                                    <Select
                                        {...register(
                                            `nutrients.${index}.unit` as const,
                                        )}
                                        defaultValue={nutrient.unit}
                                    >
                                        <option value="g">g</option>
                                        <option value="kcal">kcal</option>
                                    </Select>
                                    <IconButton
                                        aria-label="remove"
                                        icon={<BiTrash />}
                                        type="button"
                                        onClick={() => removeNutrient(index)}
                                        colorScheme="red"
                                        size="sm"
                                    />
                                </Stack>
                            ))}
                            <Button
                                mt={5}
                                type="button"
                                rightIcon={<BiPlus />}
                                onClick={() =>
                                    appendNutrient({
                                        name: "",
                                        value: "",
                                        unit: "g",
                                    })
                                }
                                colorScheme="green"
                                size="sm"
                            >
                                Add Nutrient
                            </Button>
                            <FormErrorMessage>
                                {errors.nutrients?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.ingredients}>
                            <FormLabel>Ingredients</FormLabel>
                            {ingredientFields.map((ingredient, index) => (
                                <Stack
                                    key={ingredient.id}
                                    direction={"row"}
                                    spacing={10}
                                    alignItems={"center"}
                                >
                                    <Stack
                                        direction="row"
                                        mt={2}
                                        px={5}
                                        py={5}
                                        spacing={10}
                                        alignItems={"center"}
                                        borderStyle={"dashed"}
                                        borderWidth={2}
                                        boxSize={"fit-content"}
                                    >
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Name
                                            </FormLabel>
                                            <Input
                                                placeholder="e.g Avocado"
                                                {...register(
                                                    `ingredients.${index}.name` as const,
                                                )}
                                                defaultValue={ingredient.name}
                                            />
                                        </FormControl>

                                        <Box
                                            maxH={"110px"}
                                            height={"110px"}
                                            width={"130px"}
                                        >
                                            <MemoV2FileUplaod
                                                alt={`ing-${index}`}
                                                file={
                                                    ingredient?.image?.key
                                                        ? `ingredients/${ingredient?.image?.key}`
                                                        : undefined
                                                }
                                                repo={"ingredients"}
                                                onRemove={(key) => {
                                                    handleRemoveIngriedentImg(
                                                        key,
                                                        index,
                                                        ingredient.name,
                                                    )
                                                }}
                                                onUpload={(key) => {
                                                    handleAddNewIngredientImage(
                                                        key,
                                                        index,
                                                    )
                                                }}
                                            />
                                        </Box>
                                        {/* <MemorizeFileUploadForm
                                            h={140}
                                            w={200}
                                            repo="ingredients"
                                            imgKey={ingredient?.image?.key}
                                            onUploadComplete={(keys) => {
                                                handleAddNewIngredientImage(keys, index)
                                            }}
                                            contentType="image/jpeg"
                                        /> */}
                                    </Stack>
                                    <IconButton
                                        aria-label="remove"
                                        icon={<BiTrash />}
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        colorScheme="red"
                                        size="sm"
                                    />
                                </Stack>
                            ))}
                            <Button
                                mt={5}
                                type="button"
                                rightIcon={<BiPlus />}
                                onClick={() =>
                                    appendIngredient({ name: "", image: null })
                                }
                                colorScheme="green"
                                size="sm"
                            >
                                Add ingredient
                            </Button>
                            <FormErrorMessage>
                                {errors.ingredients?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.images}>
                            <FormLabel>Images</FormLabel>
                            <HStack spacing={3} overscrollX={"auto"}>
                                {imageFields.map((image, index) => (
                                    <Box
                                        key={index}
                                        maxH={"200px"}
                                        height={"200px"}
                                        width={"230px"}
                                    >
                                        <MemoV2FileUplaod
                                            alt={`recipe-${index}`}
                                            file={
                                                image.key
                                                    ? `recipes/${image.key}`
                                                    : undefined
                                            }
                                            repo={"recipes"}
                                            onRemove={() => {
                                                removeImage(index)
                                            }}
                                            onUpload={(key) => {
                                                handleAddImage(key, index)
                                            }}
                                        />
                                    </Box>
                                ))}
                            </HStack>
                            <Button
                                mt={5}
                                type="button"
                                rightIcon={<BiPlus />}
                                onClick={() => appendImage({})}
                                colorScheme="green"
                                size="sm"
                            >
                                Add Image
                            </Button>
                            <FormErrorMessage>
                                {errors.images?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            mt={10}
                            colorScheme="green"
                            isLoading={isUpdating}
                            type="submit"
                            width={"100%"}
                        >
                            Update
                        </Button>
                    </form>
                </Box>
            )}
        </>
    )
}

const EditRecipeForm = React.memo(EditForm)

export default EditRecipeForm
