import { useState } from 'react';
import {
  AnimatePresence,
  SizableText,
  Tabs,
  YStack,
  styled,
} from 'tamagui';
import { FitnessAndWellnessActivity } from './components/fitnessAndWellness';
import { MenstrualCycle } from './components/menstrualCycle';
import { Nutrition } from './components/nutrition';
import { Colors } from '../../constants/colors';

const TabsScreen = () => {
  const [tabState, setTabState] = useState({
    currentTab: 'fitness',
    intentAt: null,
    activeAt: null,
    prevActiveAt: null,
  });

  const setCurrentTab = (currentTab) => setTabState({ ...tabState, currentTab });
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt });
  const setActiveIndicator = (activeAt) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });

  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();

  const handleOnInteraction = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      flexDirection="column"
      activationMode="manual"
      flex={1}
    
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              active
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Health and Wellness"
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
        >
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="fitness"
            onInteraction={handleOnInteraction}
          >
            <SizableText fontSize={'$3'} color={Colors.light.primary}>Fitness and Wellness</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="nutrition"
            onInteraction={handleOnInteraction}
          >
            <SizableText fontSize={'$3'} color={Colors.light.primary}>Nutrition</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="menstrual"
            onInteraction={handleOnInteraction}
          >
            <SizableText fontSize={'$3'} color={Colors.light.primary}>Menstrual Cycle</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </YStack>
      <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
        <AnimatedYStack key={currentTab} flex={1}>
          <Tabs.Content  value={currentTab} forceMount flex={1} justifyContent="center">
            {currentTab === 'fitness' && <FitnessAndWellnessActivity />}
            {currentTab === 'nutrition' && <Nutrition />}
            {currentTab === 'menstrual' && <MenstrualCycle />}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};

const TabsRovingIndicator = ({ active, ...props }) => {
  return (
    <YStack
      position="absolute"
      backgroundColor={Colors.light.primary}
      opacity={0.7}
      animation="quick"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: Colors.light.primary,
        opacity: 0.6,
      })}
      {...props}
    />
  );
};

const AnimatedYStack = styled(YStack, {
  f: 1,
  x: 0,
  o: 1,
  animation: 'quick',
  variants: {
    direction: {
      ':number': (direction) => ({
        enterStyle: {
          x: direction > 0 ? -25 : 25,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? -25 : 25,
          opacity: 0,
        },
      }),
    },
  },
});

export default TabsScreen;
