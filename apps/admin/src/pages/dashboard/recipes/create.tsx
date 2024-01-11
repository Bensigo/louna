import React from 'react'
import { AuthGuard } from '~/shared/shared/AuthGuard'
import AppLayout from '~/shared/shared/DashboardNav'
import { CreateRecipesWrapper } from '~/ui/recipes/createRecipeWraper'



function CreateRecipePage() {
  return (
    <AuthGuard>
    <AppLayout>
       <CreateRecipesWrapper />
    </AppLayout>
      
</AuthGuard>

  )
}

export default CreateRecipePage