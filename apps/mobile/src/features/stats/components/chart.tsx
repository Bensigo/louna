import { BarChart, LineChart } from "react-native-gifted-charts";
import { Card, Text, View } from "tamagui";

import { colorScheme } from "~/constants/colors";

export const Chart = ({ data, title, avg, subtitle, isBar = false }) => {
  const limitLabels = (data, maxLabels) => {
    const step = Math.ceil(data.length / maxLabels);
    return data.map((item, index) => ({
      ...item,
      label: index % step === 0 ? item.label : "",
    }));
  };

  // Limit labels to 5 (or adjust as needed)
  const limitedData = isBar ? limitLabels(data, 5) : data;
  return (
    <Card
      elevation={0}
      padding="$3"
      margin="$2"
      backgroundColor="$transperent"
      borderRadius="$4"
    >
      <View style={{ height: 300 }}>
        {isBar ? (
          <View style={{ height: 350, width: 300 }} >
            <BarChart
              data={limitedData}
              frontColor={colorScheme.primary.green} // Changed to green
              height={250}
              noOfSections={4}
              width={300}
              barWidth={20}
              spacing={10} // Corrected from barSpacing to spacing
              barMarginBottom={2}
              xAxisLabelTextStyle={{
                color: "#999",
                fontSize: 10,
                rotation: 45,
                originY: 30,
                y: 5,
              }}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "#999", fontSize: 12 }}
              hideRules
              rulesType="solid"
              rulesColor="rgba(200,200,200,0.2)"
              autoShiftLabels
              renderTooltip={(item, index) => (
                <Card
                  my={10}
                  key={index}
                  position="absolute"
                  p={15}
                  backgroundColor={"$backgroundFocus"}
                >
                  <Text fontWeight={'Bold'}  fontSize={'$3'}>
                    {title}: {item?.value}
                  </Text>
                  <Text fontWeight={400} fontSize={'$2'}>{`on ${data[index].timestamp.toDateString()}`}</Text>
                </Card>
              )}
            />
          </View>
        ) : (
          <LineChart
            data={data}
            color={colorScheme.primary.lightGreen}
            startOpacity={0.9}
            endOpacity={0.2}
            height={250}
            width={300}
            hideDataPoints
            areaChart5
            noOfSections={3}
            curved
            thickness={2}
            xAxisLabelTextStyle={{
              color: "#999",
              fontSize: 10,
              rotation: 45,
              originY: 30,
              y: 5,
            }}
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "#999", fontSize: 12 }}
            hideRules
            rulesType="solid"
            rulesColor="rgba(200,200,200,0.2)"
            showDataPointLabel={true} // Added to show label for points with data
          />
        )}
      </View>
    </Card>
  );
};
