import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { PartnerListWrapper } from '~/ui/partners/Wrapper'

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

function PartnerList({ userId }: { userId: string }) {
  return (
    <AuthGuard userId={userId}>
        <AppLayout>
            <PartnerListWrapper />
        </AppLayout>
          
    </AuthGuard>
  

  )
}

export default PartnerList