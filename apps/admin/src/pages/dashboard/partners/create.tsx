import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreatePartnerWrapper } from "~/ui/partners/CreatePartnerWrapper";

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

function CreatePartner({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
                <CreatePartnerWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default CreatePartner;