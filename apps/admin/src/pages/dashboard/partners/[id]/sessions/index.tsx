import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav";
import { ListSessionWrapper } from "~/ui/partners/sessions/ListSessionWrapper";




function ListPartnerSesssionPage() {
    return (
      <AuthGuard>
          <AppLayout>
              <ListSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  ListPartnerSesssionPage