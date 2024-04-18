import React, { } from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { HomeWrapper } from '~/ui/home/HomeWrapper'


import { withServerSideAuth } from '@clerk/nextjs/ssr';

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


function DashboardHome({ userId }: any ) {
  return (

        <AppLayout>
            <HomeWrapper />
       </AppLayout> 
   
  

  )
}

export default DashboardHome