import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { PartnerWrapper } from "~/ui/partners/PartnerWrapper";


function GetPartner() {
    return (
      <AuthGuard>
          <AppLayout>
             <PartnerWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default GetPartner;