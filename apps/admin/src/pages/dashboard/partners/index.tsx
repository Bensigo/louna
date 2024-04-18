import React from 'react'
import AppLayout from '~/shared/DashboardNav'
import { PartnerListWrapper } from '~/ui/partners/Wrapper'

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
function PartnerList({ userId }: { userId: string }) {
  return (

        <AppLayout>
            <PartnerListWrapper />
        </AppLayout>
          

  

  )
}

export default PartnerList