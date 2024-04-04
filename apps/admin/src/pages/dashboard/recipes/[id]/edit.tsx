import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import EditRecipeWrapper from "~/ui/recipes/EditRecipeWrapper";

import { withServerSideAuth } from "@clerk/nextjs/ssr"

export const getServerSideProps = withServerSideAuth((context) => {
    const { sessionId, userId } = context.req.auth
    return {
        props: {
            userId,
            sessionId,
        },
    }
})

function EditRecipePage({ userId }: {userId: string} ) {
    return (
      <AuthGuard userId={userId}>
      <AppLayout>
            <EditRecipeWrapper />
      </AppLayout>
        
  </AuthGuard>
  
    )
  }
export default EditRecipePage;