
import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { CreateSmwWrapper } from "~/ui/smw/CreateSmwWrapper";


function CreateSMWPage() {
    return (
      <AuthGuard>
          <AppLayout>
            <CreateSmwWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default CreateSMWPage;  