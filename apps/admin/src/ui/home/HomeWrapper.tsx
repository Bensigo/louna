import { Box, HStack, Select, Skeleton, Text } from "@chakra-ui/react"

import { api } from "~/utils/api"
import { StatsCard } from "./component/StatsCard"
import AreaChart from "./component/AreaChart"
import { useSearchParams, usePathname } from "next/navigation"
import { useRouter } from "next/router"
import {  useState } from "react"

const HomeWrapper = () => {
    const params = useSearchParams()
  
    const pathname = usePathname()
    const { replace } = useRouter()
    const intervalParam = params.get("interval")

    const [interval, setInterval ] = useState(intervalParam || 'day')


    const { data: stats, isLoading: isLoadingStats } =
        api.metric.stats.useQuery()



    const { data: userMetrics , isLoading } = api.metric.userMetrics.useQuery({ timeRange: interval || 'day' })  

    console.log({ interval })   

    const handleChange = (e: any) => {
        const value = e.target.value as string
        const currentParams = new URLSearchParams(params)
        currentParams.set("interval", value)
        setInterval(value)
        replace(`${pathname}?${currentParams.toString()}`)
    }

    return (
        <Box>
               <Text  my={3} fontWeight={'bold'} fontSize={'x-large'}>Overview and Metrics</Text>
            <HStack spacing={3} >
                <Skeleton isLoaded={!isLoadingStats}>
                    <StatsCard
                        name="Active User"
                        value={stats?.totalActiveUser || 0}
                        helpText="Total active users"
                    />
                </Skeleton>
                <Skeleton isLoaded={!isLoadingStats}>
                    <StatsCard
                        name="Total User"
                        value={stats?.totalUsers || 0}
                        helpText="Total users"
                    />
                </Skeleton>
                <Skeleton isLoaded={!isLoadingStats}>
                    <StatsCard
                        name="Active User"
                        value={stats?.totalActivePartner || 0}
                        helpText="Total active Partner"
                    />
                </Skeleton>
              </HStack>
              <HStack mt={3} spacing={3}>  

                <Skeleton isLoaded={!isLoadingStats}>
                    <StatsCard
                        name="Total Partner"
                        value={stats?.totalPartner || 0}
                        helpText="Total Partner"
                    />
                </Skeleton>
                <Skeleton isLoaded={!isLoadingStats}>
                    <StatsCard
                        name="Total Subscribers"
                        value={stats?.totalSubscriber || 0}
                        helpText="Total Subscribers"
                    />
                </Skeleton>
            </HStack>
           <Skeleton isLoaded={!isLoading}>
         <Box mt={5}  px={6} py={5} boxShadow={'md'}  >
                  <HStack>
                     <Text>User Growth Metrics</Text>
                     <Select
                        placeholder="select Timestamp"
                        size={'sm'}
                        value={interval}
                        maxW={120}
                       onChange={handleChange}
                    >
                        <option value="day">24 hours</option>
                        <option value="week">week</option>
                        <option value="month">month</option>
                        <option value="year">year</option>
                        
                        
                    </Select>
                  </HStack>
                    <AreaChart  data={userMetrics || []} interval={interval === 'day'? 'hour': interval}/>
                </Box>
           </Skeleton>
        </Box>
    )
}

export { HomeWrapper }
