import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditSMWWrapper } from "~/ui/smw/EditSMWWrapper";

function SMWDetailPage() {
    return (
      <AuthGuard>
          <AppLayout>
                <EditSMWWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SMWDetailPage;  