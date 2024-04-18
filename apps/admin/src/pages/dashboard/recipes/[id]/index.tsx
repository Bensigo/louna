import AppLayout from "~/shared/DashboardNav";
import { RecipeDetailWrapper } from "~/ui/recipes/RecipeDetailWrapper";

import { withServerSideAuth } from "@clerk/nextjs/ssr"

export const getServerSideProps = withServerSideAuth(async context => {
  const { sessionId, userId } = context.req.auth;

  if (!userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      userId,
      sessionId
    },
  };
});

function RecipeDetailPage({ userId }: { userId: string }) {
    return (
     
      <AppLayout>
            <RecipeDetailWrapper />
      </AppLayout>
        

  
    )
  }
export default RecipeDetailPage;