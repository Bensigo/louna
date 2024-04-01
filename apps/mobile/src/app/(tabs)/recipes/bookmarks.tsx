import { FlatList, RefreshControl } from "react-native";
import {  Text, View } from "tamagui"
import { api } from "../../..//utils/api";
import { useRef, useState } from "react";
import { Skeleton } from "moti/skeleton";
import { RecipeItem, RecipeSkeleton } from "../../../components/recipeItem";

const BOOKMARK_LIMIT = 50

const Bookmarks = () => {
  const [page, setPage] = useState(1)
  const onEndReachedCalledDuringMomentum = useRef(true)
  const bookmarkRef = useRef()

  const { data: bookmarks, isLoading, isRefetching, refetch } = api.recipe.listBookmark.useQuery({
    limit: BOOKMARK_LIMIT,
    page
  })


  const renderItem = ({ item }) => {
     return <RecipeItem recipe={item.recipe} />
    
  }


  const handleUpdateList = ({ distanceFromEnd }: any) => {
    if (!onEndReachedCalledDuringMomentum.current) {
        setPage((prev) => prev + 1)
        onEndReachedCalledDuringMomentum.current = true
    }
}
 

    return (
        <View  flex={1} mb={"$3"} mt={"$8"} paddingHorizontal={"$3.5"}>
          
                 <FlatList
                 data={bookmarks}
                 ref={bookmarkRef}
                 renderItem={renderItem}
                 scrollEnabled
                 showsVerticalScrollIndicator={false}
                 ListEmptyComponent={() =>  isLoading ? <RecipeSkeleton /> :<Text>No bookmarks found</Text>}
                 keyExtractor={(item) => item.id}
                
                 refreshControl={
                     <RefreshControl
                         onRefresh={refetch}
                         refreshing={isRefetching}
                     />
                 }
         
                 onEndReached={handleUpdateList}
                 onEndReachedThreshold={0.7}
                 onMomentumScrollBegin={() => {
                     onEndReachedCalledDuringMomentum.current = false
                 }}
                 maxToRenderPerBatch={50}
                 initialScrollIndex={0}
                
                 onScrollToIndexFailed={({ index, averageItemLength }) => {
                     bookmarkRef.current?.scrollToOffset({
                         offset: index * averageItemLength,
                         animated: true,
                     })
                 }}
             />
            
        </View>
    )
}


export default Bookmarks;