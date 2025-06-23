# Student Profile Dashboard

A dynamic web application designed to provide students with a clear overview of their academic progress, including XP (Experience Points), completed exercises, average grades, and skill development, fetched from a GraphQL API. The dashboard is built with a focus on modularity, maintainability, and a responsive user experience.

## ✨ Features

* **User Authentication:** Secure login functionality to access the dashboard.
* **Interactive Dashboard:**
    * **Stats Cards:** Display real-time total XP, completed exercises, and average grade.
    * **XP Progress Chart:** Visualize XP accumulation over weekly, monthly, or yearly periods (currently mocked, but ready for real data).
    * **Recent Exercises Table:** List recently completed exercises with grades.
    * **Skills Progress:** Track proficiency in various skills with progress bars.
* **User Profile View:** A dedicated page displaying comprehensive personal information fetched from the user's GraphQL attributes.
* **Client-Side Routing (SPA):** Seamless navigation between dashboard and profile views without full page reloads, implemented using a custom router.
* **Dark/Light Mode Toggle:** Persistent theme preference with a user-friendly toggle.
* **Modular JavaScript Architecture:** Clean, organized codebase using ES6 modules for improved readability, maintainability, and scalability.
* **GraphQL Integration:** Fetches all dynamic data (user info, XP, exercises, skills) from a GraphQL endpoint.

## 🛠 Technologies Used

* **HTML5:** For semantic structure.
* **CSS3:** Styling, including CSS variables for easy theming (light/dark mode).
* **JavaScript (ES6+):** Core application logic, modular design.
    * Custom `AuthService` for authentication.
    * Custom `GraphQLService` for API interactions.
    * Custom `Router` for client-side navigation.
    * Modularized components for UI elements (e.g., `StatsCard`, `ThemeManager`, `Sidebar`).
* **GraphQL:** For efficient data querying.

## 📂 Project Structure

The JavaScript codebase is highly modularized for clarity and maintainability:

```
.
├── go.mod
├── LICENSE
├── main.go
├── public
│   ├── assets
│   │   └── avatar_placeholder.png
│   ├── css
│   │   └── styles.css
│   ├── index.html
│   └── src
│       ├── app.js
│       ├── components
│       │   ├── Navbar.js
│       │   ├── Sidebar.js
│       │   ├── StatsCard.js
│       │   └── ThemeManager.js
│       ├── constants.js
│       ├── dashboard
│       │   ├── dashboardDataHandler.js
│       │   ├── dashboardView.js
│       │   ├── index.js
│       │   └── profileView.js
│       └── services
│           ├── authService.js
│           ├── graphqlService.js
│           └── router.js
└── README.md

```

## 🚀 Setup and Installation

To get this project up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nyunja/student-dashboard.git
    cd student-dashboard
    ```
2.  **Run the program:**
    ```bash
    go run main.go
    ```
3. **Access the hosted site on render**
    ```
    https://student-dashboard-yjuq.onrender.com/login
    ```

## 💡 Usage

1.  **Login:**
    * You will be presented with the login form.
    * Enter your credentials. (If you're testing, ensure your `AuthService` and `GraphQLService` endpoints are correctly configured and accessible).
2.  **Navigation:**
    * After successful login, you'll be redirected to the Dashboard.
    * Use the sidebar to navigate between "Dashboard" and "Profile" views.
    * The user's name in the header is also clickable to go to the profile.
3.  **Theme Toggle:**
    * Click the sun/moon icon in the sidebar footer to switch between light and dark modes. Your preference will be saved.

## 📈 Future Enhancements

* **Error Boundaries:** More robust UI for handling API errors or data loading failures.
* **Loading States:** Indicate loading states for data-intensive sections (e.g., skeleton loaders).
* **Filtering/Sorting:** Add options to filter or sort recent exercises.
* **User Settings:** Allow users to update their profile information.
* **Notifications:** Implement a simple notification system.
* **Unit & Integration Tests:** Add automated tests for JavaScript modules.
* **Build Tooling:** Integrate a module bundler (e.g., Webpack, Rollup, Parcel) for production optimizations (minification, transpilation, tree-shaking).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.