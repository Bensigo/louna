
import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateSmwWrapper } from "~/ui/smw/CreateSmwWrapper";

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


function CreateSMWPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
          <AppLayout>
            <CreateSmwWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateSMWPage;  