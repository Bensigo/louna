import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditSMWWrapper } from "~/ui/smw/EditSMWWrapper";

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
                <EditSMWWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SMWDetailPage;  