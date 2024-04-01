import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateExpertWrapper } from "~/ui/expert/CreateWraaper";

function AdddSoluInstructors() {
    return (
      <AuthGuard>
          <AppLayout>
            <CreateExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default AdddSoluInstructors;  