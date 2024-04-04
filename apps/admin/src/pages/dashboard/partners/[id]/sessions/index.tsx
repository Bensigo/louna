import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav";
import { ListSessionWrapper } from "~/ui/partners/sessions/ListSessionWrapper";


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

function ListPartnerSesssionPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              <ListSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  ListPartnerSesssionPage