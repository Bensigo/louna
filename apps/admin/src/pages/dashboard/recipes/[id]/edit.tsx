import AppLayout from "~/shared/DashboardNav";
import EditRecipeWrapper from "~/ui/recipes/EditRecipeWrapper";

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

function EditRecipePage({ userId }: {userId: string} ) {
    return (
    
      <AppLayout>
            <EditRecipeWrapper />
      </AppLayout>
        
  
    )
  }
export default EditRecipePage;