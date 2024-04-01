import { AuthGuard } from "~/shared/AuthGuard"
import AppLayout from "~/shared/DashboardNav"
import { UpdateSessionWrapper } from "~/ui/partners/sessions/UpdateSessionWrapper"



function ViewUpdateSesssionPage() {
    return (
      <AuthGuard>
          <AppLayout>
               <UpdateSessionWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

  export default  ViewUpdateSesssionPage