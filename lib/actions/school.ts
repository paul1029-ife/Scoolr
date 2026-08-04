"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Role } from "@/lib/generated/prisma/enums";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "School name must be at least 3 characters")
    .max(120, "School name is too long"),
});

export type CreateSchoolData = z.infer<typeof createSchoolSchema>;

/** "Triumphant Baptist College" -> "triumphant-baptist-college" */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/** Appends a counter until the slug is free — two schools can share a name. */
async function uniqueSlug(base: string): Promise<string> {
  const root = base || "school";

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    const taken = await prisma.school.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!taken) return candidate;
  }

  // Astronomically unlikely, but never loop forever.
  return `${root}-${Date.now().toString(36)}`;
}

function splitName(name: string | null | undefined, email: string) {
  const source = name?.trim() || email.split("@")[0] || "User";
  const [first, ...rest] = source.split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") };
}

/**
 * Registers a new school for the signed-in person and makes them its admin.
 *
 * This is the path for someone who signed up without an invitation. Joining an
 * *existing* school is invitation-only — otherwise anyone could sign up and
 * land inside a school that isn't theirs.
 */
export async function createSchool(
  data: CreateSchoolData
): Promise<ActionResult> {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { ok: false, error: "You are not signed in." };
  }

  const parsed = createSchoolSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid school name",
    };
  }

  // Someone who already belongs somewhere must not create a second school and
  // silently orphan their existing one.
  const existing = await prisma.user.findUnique({
    where: { authUserId: session.user.id },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      error: "Your account already belongs to a school.",
    };
  }

  const email = session.user.email.toLowerCase();
  const { firstName, lastName } = splitName(session.user.name, email);
  const slug = await uniqueSlug(slugify(parsed.data.name));

  await prisma.$transaction(async (tx) => {
    const school = await tx.school.create({
      data: { name: parsed.data.name, slug },
      select: { id: true },
    });

    await tx.user.create({
      data: {
        authUserId: session.user.id,
        schoolId: school.id,
        // Whoever registers the school runs it.
        role: Role.ADMIN,
        email,
        firstName,
        lastName,
        imageUrl: session.user.image ?? null,
      },
    });
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
