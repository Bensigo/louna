import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditResourcesWrapper } from "~/ui/resources/EditWrapper";

function EditResourcesPage() {
    return (
      <AuthGuard>
          <AppLayout>
              <EditResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default EditResourcesPage;  