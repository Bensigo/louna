import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateExpertWrapper } from "~/ui/expert/CreateWraaper";


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

function AdddSoluInstructors({ userId }:{ userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
            <CreateExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default AdddSoluInstructors;  