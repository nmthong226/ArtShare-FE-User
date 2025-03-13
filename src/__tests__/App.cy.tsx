/// <reference types="cypress" />

import App from '../../src/App'; // Make sure the path is correct based on your project structure

describe('App Component', () => {

  it('renders the header text', () => {
    // Mount the App component
    cy.mount(<App />);

    // Check if the header text is displayed
    cy.contains('Vite + React').should('be.visible');
  });

  it('handles accordion toggle', () => {
    // Mount the App component
    cy.mount(<App />);

    // Open the accordion item
    cy.get('[data-state="closed"]')
      .contains('Is it accessible?')
      .click();

    // Check if the accordion content is visible after opening
    cy.get('[data-state="open"]').should('be.visible');
    cy.contains('Yes. It adheres to the WAI-ARIA design pattern.').should('be.visible');
  });

  it('checks button click', () => {
    // Mount the App component
    cy.mount(<App />);

    // Click the button and check if some behavior happens
    cy.get('button').contains('Click me').click();
    // Add any assertions for button click functionality if needed
  });
});
