describe('Page d’inscription', () => {
  beforeEach(() => {
    cy.visit('/app/inscription')
  })

  it('affiche le formulaire d’inscription', () => {
    // Formulaire visible
    cy.get('form').should('exist').and('be.visible')

    // Titre et champs principaux
    cy.contains('Bienvenue sur La Pince').should('be.visible')
    cy.get('input[aria-label="Email"]').should('exist')

    // Bouton de soumission
    cy.get('button[type="submit"]').should('exist').and('be.visible')
  })
})