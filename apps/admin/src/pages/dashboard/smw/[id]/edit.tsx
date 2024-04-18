import AppLayout from "~/shared/DashboardNav";
import { EditSMWWrapper } from "~/ui/smw/EditSMWWrapper";

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

function SMWDetailPage({ userId }: { userId: string }) {
    return (
      
          <AppLayout>
                <EditSMWWrapper />
          </AppLayout>
            
      
    
  
    )
  }

export default SMWDetailPage;  