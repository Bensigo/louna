import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { View } from "tamagui";

import type { FormData as BasicInfoData } from "./forms/createChallenge/basic";
import type { FormData as AdditionalInfo } from "./forms/createChallenge/more";
import Wizard from "~/components/wizard";
import Step from "~/components/wizard/step";
import { BasicInfoForm } from "./forms/createChallenge/basic";
import { AdditionalDetailsForm } from "./forms/createChallenge/more";
import { api } from "~/utils/api";

const CreateChallenge = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;

  const [basicInfo, setBasicInfoData] = useState<BasicInfoData>({
    name: "",
    description: "",
    capacity: "",
    visibility: "Public",
    startDateTime: new Date(),
    endDateTime: undefined,
  });

  const [additionalInfo, setAdditionalInfoData] = useState<AdditionalInfo>({
    locationName: "",
    locationLat: 0,
    locationLng: 0,
    activities: [],
  });

  const basiInfoRef = useRef<{ submit: () => void }>(null);
  const additionalInfoRef = useRef<{ submit: () => void }>(null);

  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: createChallenge, isLoading } = api.challenges.create.useMutation();

  const handleNext =  () => {
    if (submitting) return;
    setSubmitting(true);

    if (currentStep === 0) {
       basiInfoRef.current?.submit();
    } else if (currentStep === totalSteps - 1) {
       additionalInfoRef.current?.submit();
    }

    setSubmitting(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBasicInfoSubmit = (data: BasicInfoData, isValid: boolean) => {
    if (!isValid) return;
    setBasicInfoData(data);
    setCurrentStep(currentStep + 1);
  };

  const handleAdditionalInfoSubmit = async (data: AdditionalInfo) => {
    setAdditionalInfoData(data);
    await handleCreateChallenge(basicInfo, data)
    // Immediately sync the data
    // setCurrentStep(currentStep + 1);
  };

  const handleCreateChallenge = async (basicInfo: BasicInfoData, moreInfo: AdditionalInfo) => {
    const { locationLat, locationLng, locationName, activities } = moreInfo;
    const { name, description, capacity, visibility, startDateTime, endDateTime } = basicInfo;

    await createChallenge(
      {
        name,
        locationLat,
        locationLng,
        locationName,
        activities,
        description,
        capacity,
        visibility,
        startDateTime,
        endDateTime,
      },
      {
        onError(err) {
          Alert.alert("Error creating challenge", err.message);
          setSubmitting(false)
        },
        onSuccess() {
          router.push("/challenges#created");
        },
      },
    );
  };

  return (
    <View flex={1}>
      <Wizard
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isSubmiting={isLoading || submitting}
      >
        <Step>
          <BasicInfoForm
            onSubmit={handleBasicInfoSubmit}
            formRef={basiInfoRef}
            defaultValues={basicInfo}
          />
        </Step>

        <Step>
          <AdditionalDetailsForm
            onSubmit={handleAdditionalInfoSubmit}
            defaultValues={additionalInfo}
            formRef={additionalInfoRef}
          />
        </Step>
      </Wizard>
    
    </View>
  );
};

export default CreateChallenge;