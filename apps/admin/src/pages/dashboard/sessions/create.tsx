import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateSessionWrapper } from "~/ui/sessions/CreateWrapper";


function CreateSessionsPage() {
    return (
      <AuthGuard>
          <AppLayout>
            < CreateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateSessionsPage;  