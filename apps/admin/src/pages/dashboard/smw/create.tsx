

import AppLayout from "~/shared/DashboardNav";
import { CreateSmwWrapper } from "~/ui/smw/CreateSmwWrapper";

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

function CreateSMWPage({ userId }: { userId: string }) {
    return (

          <AppLayout>
            <CreateSmwWrapper />
          </AppLayout>
            

    
  
    )
  }

export default CreateSMWPage;  