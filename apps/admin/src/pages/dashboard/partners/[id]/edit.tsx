import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditPartnerProfileWrapper } from "~/ui/partners/EditPartnerProfileWrapper";

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


function EditPartner({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
              <EditPartnerProfileWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default EditPartner;