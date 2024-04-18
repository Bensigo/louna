import AppLayout from "~/shared/DashboardNav";
import { PartnerWrapper } from "~/ui/partners/PartnerWrapper";
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

function GetPartner() {
    return (

          <AppLayout>
             <PartnerWrapper />
          </AppLayout>

    
  
    )
  }

 export default GetPartner;