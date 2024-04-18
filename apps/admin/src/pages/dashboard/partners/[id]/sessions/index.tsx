import AppLayout from "~/shared/DashboardNav";
import { ListSessionWrapper } from "~/ui/partners/sessions/ListSessionWrapper";


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

function ListPartnerSesssionPage({ userId }: { userId: string }) {
    return (

          <AppLayout>
              <ListSessionWrapper />
          </AppLayout>
            

    
  
    )
  }

  export default  ListPartnerSesssionPage