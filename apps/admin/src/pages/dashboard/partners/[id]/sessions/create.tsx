import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav"
import { CreateSessionWrapper } from "~/ui/partners/sessions/CreateSessionWrapper"



function CreatePartnerSesssionPage() {
    return (
      <AuthGuard>
          <AppLayout>
                <CreateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  CreatePartnerSesssionPage