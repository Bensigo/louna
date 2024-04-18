import AppLayout from "~/shared/DashboardNav";
import { ExpertDetailWrapper } from "~/ui/expert/ExpertDetailWrapper";

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

function InstructorPage({ userId }: { userId: string }) {
    return (
     
          <AppLayout>
             <ExpertDetailWrapper />
          </AppLayout>
            

    
  
    )
  }

export default InstructorPage;  