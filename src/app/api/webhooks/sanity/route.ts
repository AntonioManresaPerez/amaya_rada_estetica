import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const TAGS = ["service", "post", "beforeAfter", "testimonial", "siteSettings"];

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const docType = body?._type as string | undefined;

    if (docType && TAGS.includes(docType)) {
      revalidateTag(docType, "default");
    } else {
      TAGS.forEach((tag) => revalidateTag(tag, "default"));
    }

    return NextResponse.json({ revalidated: true, docType: docType ?? "all" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
