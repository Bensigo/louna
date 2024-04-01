import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import ExpertWrapper from "~/ui/expert/ExpertWrapper";




function DashboardSoluExpert() {
    return (
      <AuthGuard>
          <AppLayout>
              < ExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default DashboardSoluExpert;  
