import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Stack,
    Tag,
    Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { BiPlus, BiTrash } from "react-icons/bi"
import { z } from "zod"

import { MemorizeFileUploadForm } from "~/shared/shared/FileUpload"
import { MultiFileUpload } from "~/shared/shared/MultiFileUpload"

const createRecipeFormSchema = z.object({
    name: z.string().trim().min(3),
    duration: z.string().refine((data) => !isNaN(parseInt(data)), {
        message: "Please enter a valid number for duration.",
        path: ["duration"],
    }),
    calories: z.string().refine((data) => !isNaN(parseInt(data)), {
        message: "Please enter a valid number for calories.",
        path: ["calories"],
    }),
    description: z.string().trim().min(50),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
    dietType: z.enum(["Standard", "Vegan", "Paleo", "Vegetarian"]),
    steps: z.array(
        z.object({
            value: z.string(),
        }),
    ),
    nutrients: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
            unit: z.enum(["g", "kcal"]),
        }),
    ),
    ingredients: z.array(
        z.object({
            name: z.string(),
            image: z.object({
                key: z.string(),
                repo: z.string()
            })
        }),
    ),
    images: z.array(z.object({
        key: z.string(),
        repo: z.string()
    })),
    categories: z.array(z.string())
})

type CreateRecipeFormType = z.infer<typeof createRecipeFormSchema>

const categories = ["Under 15 mins", "8 ingredients", "Easy to prepare", "Meal prep", "On budget", "Family friendly"];

const CreateRecipeForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
        watch,
    } = useForm<CreateRecipeFormType>({
        resolver: zodResolver(createRecipeFormSchema),
    })
    

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
    } = useFieldArray({
        control,
        name: "ingredients",
    })

  

    const submitRecipe = (data: CreateRecipeFormType) => {
        console.log("called")
        // Handle form submission logic
        console.log(data)
    }

    const handleAddNewIngredientImage = React.useCallback((keys: string[], index: number) => {
       
        // const key = keys[0] as string
        // const temp = ingredients || []
        // temp[index] = { key, name, repo: 'ingredients', index }
        // setIngredients(temp)
        const ingredients = getValues().ingredients;
        const name = ingredients[index]?.name as string
        ingredients[index] = { name, image: { key: keys[0] as string, repo: 'ingredients' }}
        console.log({ ingredients  })
        setValue(`ingredients.${index}.image`, { key: keys[0] as string, repo: 'ingredients' });
    }, [])

    const selectedCategories = watch("categories") || [];

    const toggleCategory = (category: string) => {
      const currentCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setValue("categories", currentCategories);
    };

    return (
        <Box p={4} maxW="xl">
            <form onSubmit={handleSubmit(submitRecipe)}>
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input {...register("name")} />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <Stack direction={"row"}>
                    <FormControl mt={4} isInvalid={!!errors.duration}>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <NumberInput min={0}>
                            <NumberInputField {...register("duration")} />
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
                            <NumberInputField {...register("calories")} />
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

               

                <Stack direction={'row'} spacing={5}>
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
                        <option value="Vegetarian">Vegetarian</option>
                    </Select>
                    <FormErrorMessage>
                        {errors.dietType?.message}
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
                            selectedCategories.includes(category) ? "green" : "gray"
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
                                {...register(`steps.${index}.value` as const)}
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
                    <FormErrorMessage>{errors.steps?.message}</FormErrorMessage>
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
                            appendNutrient({ name: "", value: "", unit: "g" })
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
                        <Stack  key={ingredient.id} direction={'row'} spacing={10} alignItems={'center'}>
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
                                  <FormLabel fontSize={'sm'}>Name</FormLabel>
                                    <Input
                                        placeholder="e.g Avocado"
                                        {...register(
                                            `ingredients.${index}.name` as const,
                                        )}
                                        defaultValue={ingredient.name}
                                    />
                                  </FormControl>
                                <MemorizeFileUploadForm
                                    h={140}
                                    w={200}
                                    repo="ingredients"
                                    onUploadComplete={(keys) => {
                                        handleAddNewIngredientImage(keys, index)
                                    }}
                                    contentType="image/jpeg"
                                />
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
                        onClick={() => appendIngredient({ name: "" })}
                        colorScheme="green"
                        size="sm"
                    >
                        Add ingredient
                    </Button>
                    <FormErrorMessage>
                        {errors.ingredients?.message}
                    </FormErrorMessage>
                </FormControl>

                {/* ... Submit button and closing tags ... */}
                <FormControl mt={4} isInvalid={!!errors.images}>
                    <FormLabel>Images</FormLabel>
                    <MultiFileUpload
                        onUploadComplete={(vals) => setValue("images", vals.map((t) =>( {key:  t, repo: 'recipes' })))}
                        contentType="image/jpeg"
                    />
                    <FormErrorMessage>
                        {errors.images?.message}
                    </FormErrorMessage>
                </FormControl>
                <Button
                    mt={10}
                    colorScheme="green"
                    type="submit"
                    width={"100%"}
                >
                    Submit
                </Button>
            </form>
        </Box>
    )
}

export default CreateRecipeForm
