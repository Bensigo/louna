import AppLayout from "~/shared/DashboardNav";
import { SMWDetailWrapper } from "~/ui/smw/SMWDetailWrapper";

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

function SMWDetailPage({ userId }: { userId: string }) {
    return (
     
          <AppLayout>
            <SMWDetailWrapper />
          </AppLayout>
            

    
  
    )
  }

export default SMWDetailPage;  