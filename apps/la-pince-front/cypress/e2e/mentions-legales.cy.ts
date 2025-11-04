describe('Mentions Légales page', () => {
  beforeEach(() => {
    cy.visit('/app/mentions-legales')
  })

  it('affiche le titre et le contenu principal', () => {
    cy.get('main').should('exist')
    cy.contains('Mentions Légales').should('be.visible')
  })

  it("permet de revenir à l'accueil via le lien de retour", () => {
    cy.contains("Retour à l'accueil").should('have.attr', 'href', '/').click()
    cy.location('pathname').should('eq', '/')
  })
})
