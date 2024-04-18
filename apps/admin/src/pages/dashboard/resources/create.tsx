
import AppLayout from "~/shared/DashboardNav";
import { CreateResourcesWrapper } from "~/ui/resources/CreateWrapper";

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

function CreateResourcesPage({ userId }: { userId: string }) {
    return (
    
          <AppLayout>
              <CreateResourcesWrapper />
          </AppLayout>
            

    
  
    )
  }

export default CreateResourcesPage;  