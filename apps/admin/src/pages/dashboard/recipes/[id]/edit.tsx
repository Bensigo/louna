import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import EditRecipeWrapper from "~/ui/recipes/EditRecipeWrapper";



function EditRecipePage() {
    return (
      <AuthGuard>
      <AppLayout>
            <EditRecipeWrapper />
      </AppLayout>
        
  </AuthGuard>
  
    )
  }
export default EditRecipePage;