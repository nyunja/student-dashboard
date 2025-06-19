export class Router {
    constructor() {
        this.routes = new Map();
        this.currentPath = window.location.pathname;
        this.notFoundHandler = this.defualtNotFoundHandler;
        this.setPopstateListener();
    }

    // Default 404 hadler
    defualtNotFoundHandler() {
        console.error("404: Route not found. Navigating to login");
    }

    /**
     * Sets up the popstate listener for browser back/frward button navigation
     */
    setPopstateListener() {
        window.addEventListener("popstate", () => {
            this.handleRoute(window.location.pathname);
        })
    }

    /**
     * Adds a new route to the router
     * @param {string} path - The URL path (e.g '/dashboard')
     * @param {Function} handler - The funtion to call when this route is matched
     */
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    /**
     * Sets the handler for routes that are not found (404)
     * @param {Function} handler - The funtion to call for 404 errors.
     */
    setNotFoundHandler(handler) {
        if (typeof handler === 'function') {
            this.notFoundHandler = handler;
        } else {
            console.warn("setNotFoundHandler expects a function");
        }
    }

    /**
     * Navigates to a ne path, updating the URL in the browser's history
     * and executing the corresponding handler.
     * @param {string} path - The target URL path.
     * @param {...any} args - Arguments to pass to the route handler.
     */
    navigate(path, ...args) {
        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }
        this.handleRoute(path, ...args);
    }

    /**
     * Internal method to execute the handler for a given path
     * @param {string} path - The path to handle.
     * @param {...any} args - Arguments to pass to the given path.
     */
    handleRoute(path, ...args) {
        const handler = this.routes.get(path);
        if (handler) {
            this.currentPath = path;
            handler(...args);
        } else {
            this.notFoundHandler();
        }
    }

    /**
     * Starts the router, handling the initial route based on the current URL.
     * This is typically called ocne DOMContentLoaded
     */
    start() {
        const currentPath = window.location.pathname;
        if (!this.routes.has(currentPath) && currentPath !== "/" && currentPath !== "/login") {
            this.notFoundHandler();
        } else {
            this.handleRoute(currentPath);
        }
    }
}