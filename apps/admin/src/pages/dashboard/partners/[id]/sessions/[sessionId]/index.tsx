import { withServerSideAuth } from "@clerk/nextjs/ssr"

import AppLayout from "~/shared/DashboardNav"
import { UpdateSessionWrapper } from "~/ui/partners/sessions/UpdateSessionWrapper"

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

function ViewUpdateSesssionPage() {
    return (
        <AppLayout>
            <UpdateSessionWrapper />
        </AppLayout>
    )
}

export default ViewUpdateSesssionPage
