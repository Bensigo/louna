import AppLayout from "~/shared/DashboardNav";
import { ListResourcesWrapper } from "~/ui/resources/ListWrapper";

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

function ResourcesPage({ userId }: { userId : string }) {
    return (

          <AppLayout>
              <ListResourcesWrapper />
          </AppLayout>
            

    
  
    )
  }

export default ResourcesPage;  