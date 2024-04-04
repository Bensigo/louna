import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav"
import { CreateSessionWrapper } from "~/ui/partners/sessions/CreateSessionWrapper"

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


function CreatePartnerSesssionPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
                <CreateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  CreatePartnerSesssionPage