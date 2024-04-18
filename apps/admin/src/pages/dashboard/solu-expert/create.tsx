
import AppLayout from "~/shared/DashboardNav";
import { CreateExpertWrapper } from "~/ui/expert/CreateWraaper";


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
function AdddSoluInstructors({ userId }:{ userId: string }) {
    return (
 
          <AppLayout>
            <CreateExpertWrapper />
          </AppLayout>
            

    
  
    )
  }

export default AdddSoluInstructors;  