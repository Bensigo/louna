import React from "react"
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next"
import { createServerSideHelpers } from "@trpc/react-query/server"
import superjson from "superjson"

import { appRouter, type RouterOutputs } from "@solu/api"
import { prisma } from "@solu/db"

import { LIMIT } from "~/utils/config"
import SEO from "~/components/SEO"
import {  StudioHeader } from "~/ui/studios/components/header"

export type Partner = NonNullable<RouterOutputs["partner"]["get"]>

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

type StudioCategory = "Fitness" | "Wellness"

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { query } = context
    const page = parseInt(query.page as string) || 1
    const categories = query?.categories ? query.categories.split(",") : []
    const subCategories = query?.subCategories
        ? query.subCategories.split(",")
        : []
    const searchName = (query.searchName as string) || ""

    const helper = createServerSideHelpers({
        router: appRouter,
        ctx: {
            prisma,
            headers: {
                "x-secret": process.env.X_SECRET,
            },
        },
        transformer: superjson,
    })

    const { partners, totalPages } = await helper.partner.list.fetch({
        filter: {
            categories,
            subCategories,
        },
        page,
        searchName,
        limit: LIMIT,
    })

    console.log({ partners })
    const serilizedResponse = partners.map((patner) => ({
        ...patner,
        addresses: patner.addresses.map((add) => ({
            createdAt: add.createdAt.toISOString(),
            updatedAt: add.updatedAt.toISOString(),
        })),
        createdAt: patner.createdAt.toISOString(),
        updatedAt: patner.updatedAt.toISOString(),
    }))

    const seoData = {
        title: `Recipes - Page ${page}`,
        description: `A list of studios for ${categories
            .join(", ")
            .toLowerCase()} . Page ${page}.`,
        keywords: `Fitness, Wellness, ${subCategories
            .join(", ")
            .toLowerCase()}, page ${page}`,
        author: "Your Website",
        ogTitle: `Studios for ${categories.join(", ")}`,
        ogDescription: `Discover our best Studios for ${categories
            .join(", ")
            .toLowerCase()}.`,
        ogImage: "https://example.com/default-recipe-image.jpg",
        ogUrl: `https://example.com/studios?page=${page}&mealType=${categories.join(
            ",",
        )}&dietType=${subCategories.join(",")}&searchName=${searchName}`,
        twitterCard: "summary_large_image",
        twitterTitle: `Studios for ${categories.join(", ")}`,
        twitterDescription: `Find the best recipes for ${subCategories
            .join(", ")
            .toLowerCase()}.`,
        twitterImage: "https://example.com/default-recipe-image.jpg",
        twitterSite: "@yourwebsite",
    }

    return {
        props: {
            seoData,
            totalPages,
            initialPartners: serilizedResponse,
            page,
            categories,
            subCategories,
        },
    }
}

const ListStudioPage: React.FC<Props> = ({
    initialPartners,
    totalPages,
    seoData,
}) => {
    return (
        <>
            <SEO {...seoData} />
            <StudioHeader
                onChangeSearch={function (
                    e: React.ChangeEvent<HTMLInputElement>,
                ): void {
                    throw new Error("Function not implemented.")
                }}
                searchName={""}
                onApplyFilters={function (
                    filters: Filters,
                    fn: () => void,
                ): void {
                    throw new Error("Function not implemented.")
                }}
                isLoading={false}
            />
            <p>{JSON.stringify(initialPartners)}</p>
            <p>{totalPages}</p>
        </>
    )
}

export default ListStudioPage
