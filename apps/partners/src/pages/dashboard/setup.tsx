import React from 'react'

import { AuthGuard } from '~/shared/AuthGuard'
import SetupWrapper from '~/ui/setup/SetupWrapper'

function Setup() {
  return (
    <AuthGuard>
        <SetupWrapper />
    </AuthGuard>
    
  )
}

export default Setup