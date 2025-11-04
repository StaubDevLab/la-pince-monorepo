describe('Home page (Landing)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('affiche le header avec le logo/branding', () => {
    // Branding "La Pince" visible
    cy.contains('La Pince').should('be.visible')

    // Header présent
    cy.get('header').should('exist')
  })

  it('affiche la navigation avec les liens d’ancre', () => {
    cy.get('a[href="#features"]').should('be.visible').and('contain.text', 'Fonctionnalités')
    cy.get('a[href="#testimonials"]').should('be.visible').and('contain.text', 'Témoignages')
    cy.get('a[href="#contact"]').should('be.visible').and('contain.text', 'Contact')
  })

  it('rend les sections principales et le footer', () => {
    cy.get('main').should('exist')
    cy.get('footer').should('exist')
  })
})