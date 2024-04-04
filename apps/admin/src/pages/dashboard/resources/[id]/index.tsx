import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { DetailResourcesWrapper } from "~/ui/resources/DetailWrapper";


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

function DetailResourcesPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              <DetailResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default DetailResourcesPage;  