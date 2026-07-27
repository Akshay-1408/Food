import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      console.log("No User Found");
      return null;
    }

    if (!STRAPI_API_TOKEN) {
      console.error("Missing STRAPI_API_TOKEN");
      return null;
    }

    const { has } = await auth();
    const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

    const email = clerkUser.emailAddresses[0].emailAddress;

    // Get all users
    const usersResponse = await fetch(`${STRAPI_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!usersResponse.ok) {
      console.error(await usersResponse.text());
      return null;
    }

    const users = await usersResponse.json();

    // Find existing user
    let existingUser = users.find(
      (u) =>
        u.email === email ||
        u.clerkid === clerkUser.id
    );

    if (existingUser) {
      // Update subscription if changed
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

    // Get authenticated role
    const roleResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    const roleData = await roleResponse.json();

    const authenticatedRole = roleData.roles.find(
      (role) => role.type === "authenticated"
    );

    if (!authenticatedRole) {
      console.error("Authenticated role not found");
      return null;
    }

    // Create new user
    const createResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        username:
          clerkUser.username ??
          email.split("@")[0],
        email,
        password: `clerk_${clerkUser.id}_${Date.now()}`,
        confirmed: true,
        blocked: false,
        role: authenticatedRole.id,
        clerkid: clerkUser.id,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || "",
        subscriptionTier,
      }),
    });

    if (!createResponse.ok) {
      console.error(await createResponse.text());
      return null;
    }

    return await createResponse.json();
  } catch (error) {
    console.error("checkUser Error:", error);
    return null;
  }
};