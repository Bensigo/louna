import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { ListSMWWrapper } from "~/ui/smw/ListSmwWrapper";


function SMWPage() {
    return (
      <AuthGuard>
          <AppLayout>
             <ListSMWWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default SMWPage;  