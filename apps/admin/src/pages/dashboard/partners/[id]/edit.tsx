import AppLayout from "~/shared/DashboardNav";
import { EditPartnerProfileWrapper } from "~/ui/partners/EditPartnerProfileWrapper";

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


function EditPartner({ userId }: { userId: string }) {
    return (

          <AppLayout>
              <EditPartnerProfileWrapper />
          </AppLayout>

    
  
    )
  }

 export default EditPartner;