import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'
import { HomeWrapper } from '~/ui/home/HomeWrapper'


function DashboardHome() {
  return (
    <AuthGuard>
        <AppLayout>
            <HomeWrapper />
        </AppLayout>
          
    </AuthGuard>
  

  )
}

export default DashboardHome