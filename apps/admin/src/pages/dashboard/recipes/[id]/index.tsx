import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { RecipeDetailWrapper } from "~/ui/recipes/RecipeDetailWrapper";

function RecipeDetailPage() {
    return (
      <AuthGuard>
      <AppLayout>
            <RecipeDetailWrapper />
      </AppLayout>
        
  </AuthGuard>
  
    )
  }
export default RecipeDetailPage;