# Navbar Component Specification

## ADDED Requirements

### Requirement: User Authentication Integration
The Navbar component SHALL integrate with the Supabase authentication system to display user information.

#### Scenario: Display user avatar when authenticated
- **WHEN** a user is logged in
- **THEN** the Navbar SHALL display the user's Google avatar image in the top-right corner

#### Scenario: Show loading state during auth check
- **WHEN** the authentication state is being checked
- **THEN** the Navbar SHALL display a loading indicator or skeleton

#### Scenario: Handle missing avatar gracefully
- **WHEN** user avatar image fails to load or is unavailable
- **THEN** the Navbar SHALL display a fallback avatar with the user's initials

### Requirement: User Profile Dropdown Menu
The Navbar component SHALL provide a dropdown menu triggered by clicking the user avatar.

#### Scenario: Open dropdown on avatar click
- **WHEN** user clicks on their avatar
- **THEN** a dropdown menu SHALL appear below the avatar
- **AND** the menu SHALL contain user information and action items

#### Scenario: Display user information in dropdown
- **WHEN** the dropdown menu is open
- **THEN** it SHALL display the user's name and email
- **AND** it SHALL display the user's avatar

#### Scenario: Close dropdown on outside click
- **WHEN** user clicks outside the dropdown menu
- **THEN** the dropdown menu SHALL close automatically

### Requirement: Sign Out Functionality
The Navbar component SHALL provide a sign-out action accessible from the user dropdown menu.

#### Scenario: Sign out on button click
- **WHEN** user clicks the "登出" button in the dropdown menu
- **THEN** the system SHALL call the `signOut` function from `useAuth` hook
- **AND** redirect the user to the home page after successful sign out

#### Scenario: Handle sign out errors
- **WHEN** sign out fails due to network or auth errors
- **THEN** the system SHALL display an error message to the user
- **AND** keep the user on the current page

### Requirement: Logo Display
The Navbar component SHALL display the OutShare logo on the left side.

#### Scenario: Logo links to home
- **WHEN** user clicks the OutShare logo
- **THEN** the user SHALL be navigated to the homepage or dashboard

#### Scenario: Logo is visible on all screen sizes
- **WHEN** the Navbar is rendered on any device
- **THEN** the OutShare logo SHALL be visible and properly sized

### Requirement: Responsive Design - Desktop Layout
The Navbar component SHALL provide a desktop-optimized layout for screens wider than 768px.

#### Scenario: Desktop layout structure
- **WHEN** viewed on a desktop screen (≥768px width)
- **THEN** the OutShare logo SHALL be positioned on the left side
- **AND** the user avatar and dropdown trigger SHALL be positioned on the right side
- **AND** both elements SHALL be horizontally aligned in a single row

### Requirement: Responsive Design - Mobile Layout
The Navbar component SHALL provide a mobile-optimized layout for screens narrower than 768px.

#### Scenario: Mobile hamburger menu
- **WHEN** viewed on a mobile screen (<768px width)
- **THEN** the Navbar SHALL display a hamburger menu icon on the right side
- **AND** clicking the hamburger icon SHALL open a mobile navigation menu

#### Scenario: Mobile menu content
- **WHEN** the mobile menu is open
- **THEN** it SHALL display the user avatar and name
- **AND** it SHALL provide a sign-out button
- **AND** it SHALL be closable via a close button or outside click

### Requirement: Visual Styling
The Navbar component SHALL follow the project's design system and provide appropriate visual feedback.

#### Scenario: White background with proper spacing
- **WHEN** the Navbar is rendered
- **THEN** it SHALL have a white background color
- **AND** it SHALL have appropriate padding (e.g., px-4 py-3)
- **AND** it SHALL have a subtle bottom border for visual separation

#### Scenario: Scrolling behavior
- **WHEN** the user scrolls the page
- **THEN** the Navbar SHALL scroll with the page content (not sticky or fixed)

#### Scenario: Interactive states
- **WHEN** user hovers over or focuses on interactive elements (avatar, logo, menu items)
- **THEN** appropriate hover and focus states SHALL be displayed
- **AND** transitions SHALL be smooth (e.g., 200ms duration)

