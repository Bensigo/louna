import { AuthGuard } from "~/shared/AuthGuard";
import AppLayout from "~/shared/DashboardNav";
import { RecipeDetailWrapper } from "~/ui/recipes/RecipeDetailWrapper";

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

function RecipeDetailPage({ userId }: { userId: string }) {
    return (
      <AuthGuard userId={userId}>
      <AppLayout>
            <RecipeDetailWrapper />
      </AppLayout>
        
  </AuthGuard>
  
    )
  }
export default RecipeDetailPage;