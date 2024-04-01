import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ListRecipeWrapper } from "~/ui/recipes/ListRecipesWrapper";




function ListRecipePage() {
    return (
      <AuthGuard>
      <AppLayout>
      <ListRecipeWrapper />
      </AppLayout>
        
  </AuthGuard>
  
    )
  }
export default ListRecipePage;
