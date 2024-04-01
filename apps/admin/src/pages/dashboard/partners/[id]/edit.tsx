import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditPartnerProfileWrapper } from "~/ui/partners/EditPartnerProfileWrapper";


function EditPartner() {
    return (
      <AuthGuard>
          <AppLayout>
              <EditPartnerProfileWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default EditPartner;