# Warzone Matches API

This project is a Spring Boot application that provides an API for managing Warzone tournament matches. It also includes two simple user interfaces to demonstrate the API.

## How to Run

1.  **Prerequisites:**
    *   Java 17
    *   Maven
    *   A MySQL database named `warzone_matches` running on `localhost:3306`.

2.  **Database Configuration:**
    *   Update the database credentials in `src/main/resources/application.properties` if they are different from the defaults (user: `root`, password: `r4qu3LE2#`).

3.  **Build the application:**
    ```bash
    mvn clean install
    ```

4.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    The application will be available at `http://localhost:8080`.

## User Interfaces

This project includes two user interfaces for viewing tournament data.

### 1. Plain JavaScript UI

*   **URL:** `http://localhost:8080/index.html`
*   **Description:** A simple client-side UI built with HTML, CSS, and JavaScript. It uses the `fetch` API to interact with the backend. This UI supports viewing tournaments and their summaries, as well as registering new tournaments, teams, and players through a navigation menu.
*   **Source code:** `src/main/resources/static/`

### 2. Thymeleaf UI

*   **URL:** `http://localhost:8080/view/tournaments` (and other `/view/*` endpoints)
*   **Description:** A server-side rendered UI built with Spring Boot and Thymeleaf. It now mirrors the functionality of the JavaScript UI, providing list views for tournaments, teams, and players, as well as forms to create new entries for each. It also supports uploading and displaying team logos.
*   **Source code:**
    *   Controller: `src/main/java/org/warzone/matches/controllers/ViewController.java`
    *   Templates: `src/main/resources/templates/`
