
import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateResourcesWrapper } from "~/ui/resources/CreateWrapper";


function CreateResourcesPage() {
    return (
      <AuthGuard>
          <AppLayout>
              <CreateResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateResourcesPage;  