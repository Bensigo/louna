

import AppLayout from "~/shared/DashboardNav"
import { ListRecipeWrapper } from "~/ui/recipes/ListRecipesWrapper"

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

function ListRecipePage({ userId }: { userId: string }) {
    return (
       
            <AppLayout>
                <ListRecipeWrapper />
            </AppLayout>
  
    )
}
export default ListRecipePage
