import AppLayout from "~/shared/DashboardNav";

import { withServerSideAuth } from "@clerk/nextjs/ssr"
import { UserDetailWrapper } from "~/ui/users/UserDetailWrapper";

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

function UserDetailPage() {
    return (
     
          <AppLayout>
               <UserDetailWrapper />
          </AppLayout>
            

    
  
    )
  }

export default UserDetailPage