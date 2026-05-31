import { sanityClient } from "./client";

interface FetchOptions<QueryResult> {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}

export async function sanityFetch<QueryResult>({
  query,
  params = {},
  tags = [],
}: FetchOptions<QueryResult>): Promise<QueryResult | null> {
  try {
    return await sanityClient.fetch<QueryResult>(query, params, {
      next: { revalidate: 3600, tags },
    });
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sanityFetch] Failed — verify NEXT_PUBLIC_SANITY_PROJECT_ID.");
    }
    return null;
  }
}
