

import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import  ChallengeSettingsComp  from '~/features/challenge/settings';


const ChallengeSettings = () => {
    const { id , startDate, endDate } = useLocalSearchParams<{
        id: string,
        startDate: string,
        endDate: string
    }>();


    

  return (
        <ChallengeSettingsComp   id={id} startDate={startDate} endDate={endDate} />
  );
};

export default ChallengeSettings;


