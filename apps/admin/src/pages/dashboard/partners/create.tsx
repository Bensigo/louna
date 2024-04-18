import AppLayout from "~/shared/DashboardNav";
import { CreatePartnerWrapper } from "~/ui/partners/CreatePartnerWrapper";

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

function CreatePartner({ userId }: { userId: string }) {
    return (

          <AppLayout>
                <CreatePartnerWrapper />
          </AppLayout>
            

    
  
    )
  }

 export default CreatePartner;