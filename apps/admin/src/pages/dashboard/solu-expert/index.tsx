import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import ExpertWrapper from "~/ui/expert/ExpertWrapper";


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




function DashboardSoluExpert({ userId }: { userId : string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              < ExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default DashboardSoluExpert;  
