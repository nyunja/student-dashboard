export default class AuthService {
  constructor() {
    this.endpoint = "https://learn.zone01kisumu.ke/api/auth/signin";
    this.token = localStorage.getItem("jwt") || null;
  }

  base64URLDecode(str) {
    try {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      switch (str.length % 4) {
        case 0:
          break;
        case 2:
          str += "==";
          break;
        case 3:
          str += "=";
          break;
        default:
          throw new Error("Invalid base64url string");
      }

      const decoded = atob(str);
      return decoded;
    } catch (error) {
      console.error("Base64URL decode error:", error);
      throw new Error("Invalid base64url string");
    }
  }

  /**
   * 
   * @param {string} identifier - Username or email
   * @param {string} password - User's password:
   * @returns {Promise<object>} - An object containing { token } on success or { error } on failure.
   */
  async login(identifier, password) {
    const credentials = btoa(`${identifier}:${password}`);

    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.error("Login failed (server error):", errorResponse);
        
        // Try to parse the error as JSON and extract the message
        let errorMessage = "Invalid credentials.";
        try {
          const errorJson = JSON.parse(errorResponse);
          if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (parseError) {
          // If parsing fails, use the raw response as the error message
          errorMessage = errorResponse;
        }
        
        return { error: errorMessage };
      }

      const responseBody = await res.text();
      let token = responseBody;

      if (responseBody.startsWith('"') && responseBody.endsWith('"')) {
        token = responseBody.slice(1, -1);
      }

      if (token && typeof token === "string" && token.split(".").length === 3) {
        localStorage.setItem("jwt", token);
        this.token = token;
        console.log("JWT successfully stored in localStorage:", token);
        return { token };
      } else {
        console.error(
          "Login succeeded, but response body does not look like a valid JWT after stripping quotes:",
          responseBody
        );
        return {
          error:
            "Authentication successful, but no valid token received from server. Please contact support.",
        };
      }
    } catch (err) {
      console.error("Login failed (network error):", err);
      return { error: "Network error. Please try again." };
    }
  }

  /**
   * Retrieves the stored token.
   * @returns {string|null} - The JWT token or null if not found.
   */
  getToken() {
    return localStorage.getItem("jwt") || this.token;
  }

  /**
   * Removes the JWT token from local storage, effectively loggin out the user.
   */
  logout() {
    localStorage.removeItem("jwt");
    this.token = null;
    console.log("User logged out. JWT removed from localStorage.")
  }

  /**
  * Checks if the user is currently authenticated by validating the JWT.
  * @returns {boolean} - True if authenticated and token is valid, false otherwise.
  */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const encodedPayload = token.split(".")[1];
      if (!encodedPayload) {
        // Add a check for payload existence
        console.error("JWT payload missing after split.");
        return false;
      }
      const payload = JSON.parse(this.base64URLDecode(encodedPayload)); // Use the helper
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > now;
    } catch (e) {
      console.error(
        "Error decoding or parsing JWT payload in isAuthenticated:",
        e
      );
      return false;
    }
  }
}
