import React from 'react'
import { AuthGuard } from '~/shared/shared/AuthGuard'
import AppLayout from '~/shared/shared/DashboardNav'
import { PartnerListWrapper } from '~/ui/partners/partnerList/wrapper'


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