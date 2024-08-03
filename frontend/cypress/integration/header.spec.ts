
describe('Header Component', () => {
  beforeEach(() => {
    // Assuming your app is running on localhost:3000
    cy.visit('http://localhost:3000');
  });

  it('should display the header', () => {
    cy.get('header').should('be.visible');
    cy.get('header h1').contains('My Real Estate App');
  });

  it('should toggle color mode', () => {
    cy.get('header button[aria-label="Toggle color mode"]').click();
    // Add assertions to check if color mode toggled (light/dark)
  });

  it('should open the drawer menu on mobile view', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-6');
    cy.get('header button[aria-label="Open menu"]').click();
    cy.get('.chakra-drawer__content').should('be.visible');
  });

  it('should show login modal when user is not logged in', () => {
    cy.get('header').then(($header) => {
      if ($header.find('button[aria-label="Open menu"]').length > 0) {
        // Mobile view
        cy.get('button[aria-label="Open menu"]').click();
        cy.get('.chakra-drawer__content').should('be.visible');
        cy.get('.chakra-drawer__body').find('button').contains('Login').should('be.visible');
      } else {
        // Desktop view
        cy.get('header').find('button').contains('Login').should('be.visible');
      }
    });
  });

  it('should show user menu and draft button when user is logged in', () => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('auth', JSON.stringify({ user: { name: 'Test User' } }));
    });
    cy.reload();

    cy.get('header').then(($header) => {
      if ($header.find('button[aria-label="Open menu"]').length > 0) {
        // Mobile view
        cy.get('button[aria-label="Open menu"]').click();
        cy.get('.chakra-drawer__content').should('be.visible');
        cy.get('.chakra-drawer__body').find('button').contains('Draft Listings').should('be.visible');
        cy.get('.chakra-drawer__body').find('button').contains('Create Listing').should('be.visible');
      } else {
        // Desktop view
        cy.get('header').find('button').contains('Draft Listings').should('be.visible');
        cy.get('header').find('button').contains('Create Listing').should('be.visible');
      }
    });
  });
});
