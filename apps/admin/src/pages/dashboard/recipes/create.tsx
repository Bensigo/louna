import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { CreateRecipeWrapper } from '~/ui/recipes/CreateRecipeWrapper'



function CreateRecipePage() {
  return (
    <AuthGuard>
    <AppLayout>
       <CreateRecipeWrapper />
    </AppLayout>
      
</AuthGuard>

  )
}
export default CreateRecipePage