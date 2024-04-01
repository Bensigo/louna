import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { SMWDetailWrapper } from "~/ui/smw/SMWDetailWrapper";

function SMWDetailPage() {
    return (
      <AuthGuard>
          <AppLayout>
            <SMWDetailWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SMWDetailPage;  