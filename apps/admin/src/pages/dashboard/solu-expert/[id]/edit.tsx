import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditExpertWrapper } from "~/ui/expert/EditInstructorWrapper";

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

function EditInstructorPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
                <EditExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default EditInstructorPage;  