import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ListSessionWrapper } from "~/ui/sessions/ListWrapper";



function SessionsPage() {
    return (
      <AuthGuard>
          <AppLayout>
             <ListSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SessionsPage;  