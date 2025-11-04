describe('Page de mot de passe oublié', () => {
  it('affiche le contenu principal (titre, champ email, bouton)', () => {
    cy.visit('/app/forgot-password')

    cy.contains('Demande de réinitialisation de mot de passe').should('be.visible')
    cy.get('main').should('exist')

    cy.get('input[aria-label="Email"]').should('exist')
    cy.get('button[aria-label="Réinitialiser le mot de passe"]').should('exist')

    // Lien retour vers la connexion
    cy.contains('connexion')
      .should('have.attr', 'href')
      .and('match', /\/app\/connexion/)
  })

  it('pré-remplit le champ email depuis la query string', () => {
    cy.visit('/app/forgot-password?email=test@example.com')
    cy.get('input[aria-label="Email"]').should('have.value', 'test@example.com')
  })
})
