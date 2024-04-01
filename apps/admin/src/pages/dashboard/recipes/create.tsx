import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
// import { CreateRecipesWrapper } from '../../../ui/recipes/CreateRecipeWraper'



function CreateRecipePage() {
  return (
    <AuthGuard>
    <AppLayout>
       {/* <CreateRecipesWrapper /> */}
       <></>
    </AppLayout>
      
</AuthGuard>

  )
}
export default CreateRecipePage