import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateSessionWrapper } from "~/ui/sessions/CreateWrapper";

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


function CreateSessionsPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
            < CreateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateSessionsPage;  