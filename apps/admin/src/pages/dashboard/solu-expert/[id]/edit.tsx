import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { EditExpertWrapper } from "~/ui/expert/EditInstructorWrapper";



function EditInstructorPage() {
    return (
      <AuthGuard>
          <AppLayout>
                <EditExpertWrapper />
          </AppLayout>
            
      </AuthGuard>
    
  
    )
  }

export default EditInstructorPage;  