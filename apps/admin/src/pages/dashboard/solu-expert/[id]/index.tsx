import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ExpertDetailWrapper } from "~/ui/expert/ExpertDetailWrapper";


function InstructorPage() {
    return (
      <AuthGuard>
          <AppLayout>
             <ExpertDetailWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default InstructorPage;  