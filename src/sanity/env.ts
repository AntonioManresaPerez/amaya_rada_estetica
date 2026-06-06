const FALLBACK_API_VERSION = "2025-01-01";

function validDate(v: string | undefined): boolean {
  return !!v && v !== "undefined" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export const apiVersion = validDate(process.env.NEXT_PUBLIC_SANITY_API_VERSION)
  ? process.env.NEXT_PUBLIC_SANITY_API_VERSION!
  : FALLBACK_API_VERSION;

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET &&
  process.env.NEXT_PUBLIC_SANITY_DATASET !== "undefined"
    ? process.env.NEXT_PUBLIC_SANITY_DATASET
    : "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "undefined"
    ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    : "";

export const studioBasePath = "/studio";
