import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ListResourcesWrapper } from "~/ui/resources/ListWrapper";


function ResourcesPage() {
    return (
      <AuthGuard>
          <AppLayout>
              <ListResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default ResourcesPage;  