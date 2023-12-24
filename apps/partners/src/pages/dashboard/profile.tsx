import React from 'react'
import { AuthGuard } from '~/shared/AuthGuard'
import AppLayout from '~/shared/DashboardNav'

function Profile() {
  return (
    <AuthGuard>
        <AppLayout>
            <div>profile</div>
        </AppLayout>
          
    </AuthGuard>
  

  )
}

export default Profile