import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { UpdateSessionWrapper } from "~/ui/sessions/UpdateWrapper";



function SessionsDetailPage() {
    return (
      <AuthGuard>
          <AppLayout>
          <UpdateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SessionsDetailPage;  