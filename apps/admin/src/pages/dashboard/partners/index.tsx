import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { PartnerListWrapper } from '~/ui/partners/Wrapper'


function PartnerList() {
  return (
    <AuthGuard>
        <AppLayout>
            <PartnerListWrapper />
        </AppLayout>
          
    </AuthGuard>
  

  )
}

export default PartnerList