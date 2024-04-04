import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { CreateRecipeWrapper } from '~/ui/recipes/CreateRecipeWrapper'

import { withServerSideAuth } from "@clerk/nextjs/ssr"

export const getServerSideProps = withServerSideAuth( (context) => {
    const { sessionId, userId } = context.req.auth
    return {
        props: {
            userId,
            sessionId,
        },
    }
})


function CreateRecipePage({ userId }: { userId: string }) {
  return (
    <AuthGuard userId={userId} >
    <AppLayout>
       <CreateRecipeWrapper />
    </AppLayout>
      
</AuthGuard>

  )
}
export default CreateRecipePage