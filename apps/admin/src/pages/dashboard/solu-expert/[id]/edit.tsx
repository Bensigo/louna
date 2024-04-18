import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditExpertWrapper } from "~/ui/expert/EditInstructorWrapper";

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


function EditInstructorPage({ userId }: { userId: string }) {
    return (

          <AppLayout>
                <EditExpertWrapper />
          </AppLayout>
            

    
  
    )
  }

export default EditInstructorPage;  