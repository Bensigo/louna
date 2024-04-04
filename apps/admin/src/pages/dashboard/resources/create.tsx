
import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateResourcesWrapper } from "~/ui/resources/CreateWrapper";

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

function CreateResourcesPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              <CreateResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateResourcesPage;  