import AppLayout from "~/shared/DashboardNav";
import ExpertWrapper from "~/ui/expert/ExpertWrapper";


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




function DashboardSoluExpert({ userId }: { userId : string }) {
    return (

          <AppLayout>
              < ExpertWrapper />
          </AppLayout>
            

    
  
    )
  }

export default DashboardSoluExpert;  
