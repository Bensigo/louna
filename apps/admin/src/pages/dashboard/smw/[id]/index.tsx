import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { SMWDetailWrapper } from "~/ui/smw/SMWDetailWrapper";

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

function SMWDetailPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
            <SMWDetailWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SMWDetailPage;  