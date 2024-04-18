import AppLayout from "~/shared/DashboardNav";
import { EditResourcesWrapper } from "~/ui/resources/EditWrapper";

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

function EditResourcesPage({ userId }: { userId: string }) {
    return (
 
          <AppLayout>
              <EditResourcesWrapper />
          </AppLayout>
            

    
  
    )
  }

export default EditResourcesPage;  