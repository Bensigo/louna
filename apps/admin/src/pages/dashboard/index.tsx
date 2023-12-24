import React from 'react'
import { AuthGuard } from '~/shared/shared/AuthGuard'
import AppLayout from '~/shared/shared/DashboardNav'


function DashboardHome() {
  return (
    <AuthGuard>
        <AppLayout>
            <div>Home</div>
        </AppLayout>
          
    </AuthGuard>
  

  )
}

export default DashboardHome