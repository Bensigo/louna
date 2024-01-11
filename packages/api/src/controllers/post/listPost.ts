import type { Like, Post } from "@solu/db";
import { listPostSchema } from "../../schemas/post";
import { protectedProcedure } from "../../trpc";
import {  endOfDay, subDays } from 'date-fns';


export const listPostController = protectedProcedure
  .input(listPostSchema)
  .query(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { skip, limit } = input;

    console.log("called api")

    // Fetch posts ordered by createdAt to get the latest posts
    const latestPosts = await prisma.post.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Comments: true,
        likes: {
          where: {
            isDeleted: false,
          },
        },
        user: true,
      },
    });

    const today = new Date()
    // const todayStart = startOfDay(today);
    const fiveDaysAgo =  subDays(today, 5)
    const end = endOfDay(fiveDaysAgo);
    // Fetch trending posts ordered by likes and comments
    const trendingPosts = await prisma.post.findMany({
      take: limit,
      skip,
      where: {
        createdAt: {
            gte: end,
            lte: today,
          },
      },
      orderBy: {
        Comments: {
          _count: 'desc',
        },
      },
      include: {
        Comments: true,
        likes: {
          where: {
            isDeleted: false,
          },
        },
        user: true,
      },
    });

    // Merge and deduplicate the posts
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mergedPosts = mergeAndDeduplicatePosts(latestPosts, trendingPosts, limit);

    return mergedPosts;
  });

type CustomPost =  Post & { likes: Like[], Comments: Comment[] }
  const calculateTrendScore = (post: CustomPost): number => {
    const likeCount = post.likes?.length || 0;
    const commentCount = post.Comments?.length || 0;
  
    // You can adjust the weight of likes and comments based on your priorities
    const score = likeCount * 0.5 + commentCount * 0.7;
  
    return score;
  };


  
  // const mergeAndDeduplicatePosts = (latestPosts: CustomPost[], trendingPosts: CustomPost[], limit: number) => {
  // const allPosts = [...latestPosts, ...trendingPosts];
  // // Calculate trend scores for all posts
  // const postsWithScore = allPosts.map((post) => ({
  //   ...post,
  //   trendScore: calculateTrendScore(post),
  // }));
  // postsWithScore.sort((a, b) => b.trendScore - a.trendScore);
  // const mergedPosts = postsWithScore.slice(0, limit);

  // return mergedPosts;
  // };
  const mergeAndDeduplicatePosts = (latestPosts: CustomPost[], trendingPosts: CustomPost[], limit: number) => {
    const uniquePostIds = new Set<string>();
    const mergedPosts: CustomPost[] = [];
  
    // Helper function to add a post to the merged list if it's not a duplicate
    const addPostToMerged = (post: CustomPost) => {
      if (!uniquePostIds.has(post.id)) {
        uniquePostIds.add(post.id);
        mergedPosts.push(post);
      }
    };
  
    // Add latest posts
    for (const post of latestPosts) {
      addPostToMerged(post);
    }
  
    // Add trending posts
    for (const post of trendingPosts) {
      addPostToMerged(post);
    }
  
    // Calculate trend scores for all posts
    const postsWithScore = mergedPosts.map((post) => ({
      ...post,
      trendScore: calculateTrendScore(post),
    }));
  
    // Sort by trend score
    postsWithScore.sort((a, b) => b.trendScore - a.trendScore);
  
    // Take the top `limit` posts
    const finalMergedPosts = postsWithScore.slice(0, limit);
  
    return finalMergedPosts;
  };
  