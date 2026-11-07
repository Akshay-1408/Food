import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    let subscriptionTier = "free";
    try {
      const { has } = await auth();
      subscriptionTier = has && has({ plan: "pro" }) ? "pro" : "free";
    } catch (authErr) {
      console.warn("Could not check Clerk subscription plan:", authErr?.message);
    }

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      `${clerkUser.id}@user.local`;

    const fallbackUser = {
      id: clerkUser.id,
      clerkid: clerkUser.id,
      email,
      username: clerkUser.username || email.split("@")[0],
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl || "",
      subscriptionTier,
    };

    if (!STRAPI_API_TOKEN) {
      return fallbackUser;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Get users from Strapi
      const usersResponse = await fetch(`${STRAPI_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!usersResponse.ok) {
        return fallbackUser;
      }

      const users = await usersResponse.json();

      // Find existing user in Strapi
      const existingUser = Array.isArray(users)
        ? users.find(
            (u) =>
              u.email === email ||
              u.clerkid === clerkUser.id
          )
        : null;

      if (existingUser) {
        // Sync subscription if changed
        if (
          existingUser.subscriptionTier !== subscriptionTier ||
          existingUser.clerkid !== clerkUser.id
        ) {
          await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
              subscriptionTier,
              clerkid: clerkUser.id,
            }),
          });

          existingUser.subscriptionTier = subscriptionTier;
          existingUser.clerkid = clerkUser.id;
        }

        return existingUser;
      }

      // User does not exist in Strapi, attempt creation
      const roleResponse = await fetch(
        `${STRAPI_URL}/api/users-permissions/roles`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
        }
      );

      let authenticatedRoleId = null;
      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        const authenticatedRole = roleData?.roles?.find(
          (role) => role.type === "authenticated"
        );
        authenticatedRoleId = authenticatedRole?.id;
      }

      const createResponse = await fetch(`${STRAPI_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          username: clerkUser.username ?? email.split("@")[0],
          email,
          password: `clerk_${clerkUser.id}_${Date.now()}`,
          confirmed: true,
          blocked: false,
          ...(authenticatedRoleId ? { role: authenticatedRoleId } : {}),
          clerkid: clerkUser.id,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          imageUrl: clerkUser.imageUrl || "",
          subscriptionTier,
        }),
      });

      if (createResponse.ok) {
        return await createResponse.json();
      }
    } catch (strapiFetchError) {
      // Strapi offline or unreachable, return fallback user
      return fallbackUser;
    }

    return fallbackUser;
  } catch (error) {
    console.error("checkUser Error:", error);
    return null;
  }
};