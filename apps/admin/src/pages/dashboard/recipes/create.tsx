import React from 'react'
import AppLayout from '~/shared/DashboardNav'
import { CreateRecipeWrapper } from '~/ui/recipes/CreateRecipeWrapper'

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


function CreateRecipePage({ userId }: { userId: string }) {
  return (
   
    <AppLayout>
       <CreateRecipeWrapper />
    </AppLayout>
      

  )
}
export default CreateRecipePage