import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { PartnerWrapper } from "~/ui/partners/PartnerWrapper";
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


function GetPartner({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
             <PartnerWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default GetPartner;