## ADDED Requirements

### Requirement: 404 Error Page
The system SHALL display a custom 404 error page when users access non-existent routes.

#### Scenario: User visits invalid URL
- **WHEN** a user navigates to a non-existent URL (e.g., `/nonexistent-page`)
- **THEN** the system displays a custom 404 error page with:
  - Navigation bar at the top
  - A clear "Page Not Found" message
  - A button to return to the homepage
  - Consistent styling with the design system
  - Responsive layout for all screen sizes

#### Scenario: Direct invalid URL access
- **WHEN** a user directly accesses an invalid URL via browser address bar
- **THEN** the system displays the same custom 404 error page with navigation bar as above
