/// <reference types="cypress" />

import App from "../../src/App";

describe("App Component (Landing Page only)", () => {
  beforeEach(() => {
    window.history.pushState({}, "Landing Page", "/");
    cy.mount(<App />);
  });

  it("renders the hero title", () => {
    cy.contains("Create, Share, Inspire").should("be.visible");
  });

  it("renders 'Start For Free' button", () => {
    cy.get("a").contains("Start For Free").should("be.visible");
  });

  it("renders pricing section", () => {
    cy.contains("PRICING PLANS").scrollIntoView().should("be.visible");
  });
});
