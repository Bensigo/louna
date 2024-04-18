
import AppLayout from "~/shared/DashboardNav";
import { ListSessionWrapper } from "~/ui/sessions/ListWrapper";


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


function SessionsPage({ userId }: { userId: string }) {
    return (
    
          <AppLayout>
             <ListSessionWrapper />
          </AppLayout>
    
  
    )
  }

export default SessionsPage;  