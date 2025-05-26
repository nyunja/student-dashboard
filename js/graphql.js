import { getToken } from "./auth.js";

const GRAPHQL_URL = "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql";

export async function graphqlRequest(query, variables = {}) {
  let token = getToken();

  if (!token) return { error: "Missing JWT. Please log in." };

  token = token.trim();

  const requestBody = JSON.stringify({ query, variables });

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    const json = await res.json();

    if (json.errors) {
        console.error("GraphQL Server Errors:", json.errors);
        return { error: json.errors[0].message };
    }
    return { data: json.data };
  } catch (err) {
    console.error("GraphQL Request - Network error:", err);
    return { error: "Failed to fetch data." };
  }
}