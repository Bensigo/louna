import AppLayout from "~/shared/DashboardNav";
import { ListSMWWrapper } from "~/ui/smw/ListSmwWrapper";

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

function SMWPage({ userId }: { userId: string }) {
    return (
 
          <AppLayout>
             <ListSMWWrapper />
          </AppLayout>
            

    
  
    )
  }

export default SMWPage;  