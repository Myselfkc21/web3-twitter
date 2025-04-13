import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "qarlnued",
  dataset: "production",
  apiVersion: "2024-03-05",
  token:
    "sk426XqXxcM7RKTsDtBR6nDoFeHjrsOKbGfkCtVROnlBGX4sKJQKYc028sSUKjMz4nvAedZUBzNC8uFH9kZRueFxngoHoF5S7zOkj041jFWYkC7pjHvTuL1KtbWjGCPVkwrWaNO9KYkQ2DpMQ5DzDpKwEljyFk6MDy3wekerp0PpZTM4GarU",
  useCdn: false,
});
