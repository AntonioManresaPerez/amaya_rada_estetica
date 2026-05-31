import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { serviceCategory } from "./serviceCategory";
import { service } from "./service";
import { post } from "./post";
import { author } from "./author";
import { beforeAfter } from "./beforeAfter";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  serviceCategory,
  service,
  post,
  author,
  beforeAfter,
  testimonial,
];
