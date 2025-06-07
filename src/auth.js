const SIGNIN_URL = "https://learn.zone01kisumu.ke/api/auth/signin";

function base64URLDecode(str) {
  try {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (str.length % 4) {
      case 0:
        break;
      case 2:
        str += '==';
        break;
      case 3:
        str += '=';
        break;
      default:
        throw new Error('Invalid base64url string');
    }
    
    
    const decoded = atob(str);
    return decoded;
  } catch (error) {
    console.error('Base64URL decode error:', error);
    throw new Error('Invalid base64url string');
  }
}


export async function login(identifier, password) {
  const credentials = btoa(`${identifier}:${password}`);

  try {
    const res = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    console.log("Login fetch response status:", res.status);
    console.log("Login fetch response ok:", res.ok);
    console.log("Login fetch response Content-Type:", res.headers.get('Content-Type'));

    if (!res.ok) {
      const errorMsg = await res.text();
      console.error("Login failed (server error):", errorMsg);
      return { error: errorMsg || "Invalid credentials." };
    }

    const responseBody = await res.text();
    console.log("Login fetch response body (raw text, with quotes if any):", responseBody);

    let token = responseBody;
    if (responseBody.startsWith('"') && responseBody.endsWith('"')) {
        token = responseBody.slice(1, -1); // Remove the first and last character
        console.log("Quotes stripped. Clean token (should not have quotes):", token);
    }

    if (token && typeof token === 'string' && token.split('.').length === 3) {
      localStorage.setItem("jwt", token);
      console.log("JWT successfully stored in localStorage:", token);
      return { token };
    } else {
      console.error("Login succeeded, but response body does not look like a valid JWT after stripping quotes:", responseBody);
      return { error: "Authentication successful, but no valid token received from server. Please contact support." };
    }

  } catch (err) {
    console.error("Login failed (network error):", err);
    return { error: "Network error. Please try again." };
  }
}


export function getToken() {
return localStorage.getItem("jwt");
}

export function logout() {
localStorage.removeItem("jwt");
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) { // Add a check for payload existence
        console.error("JWT payload missing after split.");
        return false;
    }
    const payload = JSON.parse(base64URLDecode(encodedPayload)); // Use the helper
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (e) {
    console.error("Error decoding or parsing JWT payload in isAuthenticated:", e);
    return false;
  }
}