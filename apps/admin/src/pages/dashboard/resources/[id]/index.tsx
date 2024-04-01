import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { DetailResourcesWrapper } from "~/ui/resources/DetailWrapper";

function DetailResourcesPage() {
    return (
      <AuthGuard>
          <AppLayout>
              <DetailResourcesWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default DetailResourcesPage;  