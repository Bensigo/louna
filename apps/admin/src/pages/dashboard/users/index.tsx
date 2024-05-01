import { withServerSideAuth } from "@clerk/nextjs/ssr"

import AppLayout from "~/shared/DashboardNav"
import { ListUserWrapper } from "~/ui/users/ListUserWrapper"

export const getServerSideProps = withServerSideAuth(async (context) => {
    const { sessionId, userId } = context.req.auth

    if (!userId) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }

    return {
        props: {
            userId,
            sessionId,
        },
    }
})

const ListUserPage = () => {
    return (
        <AppLayout>
            <ListUserWrapper />
        </AppLayout>
    )
}

export default ListUserPage
