import React, { } from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { HomeWrapper } from '~/ui/home/HomeWrapper'


import { withServerSideAuth } from '@clerk/nextjs/ssr';

export const getServerSideProps = withServerSideAuth(async context => {
  const { sessionId, userId } = context.req.auth;
  return {
    props: {
      userId,
      sessionId
    },
  };
});


function DashboardHome({ userId }: any ) {
  return (
    <AuthGuard userId={userId} >
        <AppLayout>
            <HomeWrapper />
       </AppLayout> 
    </AuthGuard>
  

  )
}

export default DashboardHome