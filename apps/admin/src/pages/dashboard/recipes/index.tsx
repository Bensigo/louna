

import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav"
import { ListRecipeWrapper } from "~/ui/recipes/ListRecipesWrapper"

import { withServerSideAuth } from "@clerk/nextjs/ssr"

export const getServerSideProps = withServerSideAuth((context) => {
    const { sessionId, userId } = context.req.auth
    return {
        props: {
            userId,
            sessionId,
        },
    }
})

function ListRecipePage({ userId }: { userId: string }) {
    return (
        <AuthGuard userId={userId}>
            <AppLayout>
                <ListRecipeWrapper />
            </AppLayout>
        </AuthGuard>
    )
}
export default ListRecipePage
