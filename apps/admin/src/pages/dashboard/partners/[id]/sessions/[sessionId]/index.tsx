import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav"
import { UpdateSessionWrapper } from "~/ui/partners/sessions/UpdateSessionWrapper"

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

function ViewUpdateSesssionPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
               <UpdateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  ViewUpdateSesssionPage