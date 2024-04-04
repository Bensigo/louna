import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ListResourcesWrapper } from "~/ui/resources/ListWrapper";

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

function ResourcesPage({ userId }: { userId : string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              <ListResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default ResourcesPage;  