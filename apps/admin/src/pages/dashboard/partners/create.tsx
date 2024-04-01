import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreatePartnerWrapper } from "~/ui/partners/CreatePartnerWrapper";

function CreatePartner() {
    return (
      <AuthGuard>
          <AppLayout>
                <CreatePartnerWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

 export default CreatePartner;