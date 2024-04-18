import AppLayout from "~/shared/DashboardNav";
import { DetailResourcesWrapper } from "~/ui/resources/DetailWrapper";


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

function DetailResourcesPage({ userId }: { userId: string }) {
    return (
  
          <AppLayout>
              <DetailResourcesWrapper />
          </AppLayout>
            

    
  
    )
  }

export default DetailResourcesPage;  