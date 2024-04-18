import AppLayout from "~/shared/DashboardNav";
import { UpdateSessionWrapper } from "~/ui/sessions/UpdateWrapper";

import { withServerSideAuth } from "@clerk/nextjs/ssr"

export const getServerSideProps = withServerSideAuth(async context => {
    const { sessionId, userId } = context.req.auth;
  
    if (!userId) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    
    return {
      props: {
        userId,
        sessionId
      },
    };
  });

function SessionsDetailPage({ userId }: { userId: string }) {
    return (
 
          <AppLayout>
          <UpdateSessionWrapper />
          </AppLayout>
            

    
  
    )
  }

export default SessionsDetailPage;  