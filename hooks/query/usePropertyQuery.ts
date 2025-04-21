import { getAllProperties, getPropertyById } from "@/api/api.service";
import {
  USE_FEATURED_PROPERTY_QUERY_KEY,
  USE_PROPERTY_QUERY_KEY,
  USE_OWNED_PROPERTIES_QUERY_KEY,
  USE_PROPERTIES_QUERY_KEY,
  USE_EXPLORE_PROPERTIES_QUERY_KEY,
  USE_EYEBALLING_PROPERTIES_QUERY_KEY,
} from "@/constants/common";
import { Filter } from "@/interfaces";
import {
  FeaturedPropertiesCache,
  OwnedPropertiesCache,
  PropertiesCache,
  PropertyCache,
  EyeballingPropertiesCache,
  explorePropertiesCache,
} from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const usePropertiesQuery = (filters: Filter) => {
  return useInfiniteQuery<PropertiesCache>({
    queryKey: [USE_PROPERTIES_QUERY_KEY, filters],
    queryFn: ({ pageParam = null }: any) =>
      getAllProperties(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};

export const useEyeballingPropertiesQuery = (filters: Filter) => {
  return useInfiniteQuery<EyeballingPropertiesCache>({
    queryKey: [USE_EYEBALLING_PROPERTIES_QUERY_KEY, filters],
    queryFn: ({ pageParam = null }: any) =>
      getAllProperties(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};

export const useFeaturedPropertyQuery = (filters: Filter) => {
  return useQuery<FeaturedPropertiesCache>({
    queryKey: USE_FEATURED_PROPERTY_QUERY_KEY,
    queryFn: ({ pageParam = null }: any) =>
      getAllProperties(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 120, // 2 hours
  });
};

export const useOwnedPropertyQuery = (filters: Filter) => {
  return useInfiniteQuery<OwnedPropertiesCache>({
    queryKey: USE_OWNED_PROPERTIES_QUERY_KEY,
    queryFn: ({ pageParam = null }: any) =>
      getAllProperties(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};

export const useExplorePropertyQuery = (filters: Filter) => {
  return useInfiniteQuery<explorePropertiesCache>({
    queryKey: [USE_EXPLORE_PROPERTIES_QUERY_KEY, filters],
    queryFn: ({ pageParam = null }: any) =>
      getAllProperties(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};

export const usePropertyQuery = (id: number) => {
  return useQuery<PropertyCache>({
    queryKey: [USE_PROPERTY_QUERY_KEY, id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
  });
};
