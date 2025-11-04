describe('Page de connexion', () => {
  beforeEach(() => {
    cy.visit('/app/connexion')
  })

  it('affiche le formulaire de connexion', () => {
    // Attendre que le formulaire soit visible (jusqu’à 10s si besoin)
    cy.get('form', { timeout: 10000 }).should('be.visible')

    // Champs et bouton
    cy.get('input').its('length').should('be.gte', 1)
    cy.get('button[type="submit"]').should('exist').and('be.visible')
  })
})