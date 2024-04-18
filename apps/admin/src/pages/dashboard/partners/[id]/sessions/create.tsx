import AppLayout from "~/shared/DashboardNav"
import { CreateSessionWrapper } from "~/ui/partners/sessions/CreateSessionWrapper"

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


function CreatePartnerSesssionPage({ userId }: { userId: string }) {
    return (

          <AppLayout>
                <CreateSessionWrapper />
          </AppLayout>
            

    
  
    )
  }

  export default  CreatePartnerSesssionPage