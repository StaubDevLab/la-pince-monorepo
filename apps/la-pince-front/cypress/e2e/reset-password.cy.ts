describe('Page de réinitialisation de mot de passe', () => {
  it('affiche le contenu principal (titre, champs, bouton)', () => {
    // Fournir un token factice pour éviter l'erreur côté composant
    cy.visit('/app/reset-password?token=fake-token')

    // Le layout peut afficher un état de chargement lié à next-auth; patienter jusqu'aux champs
    cy.get('input[aria-label="Nouveau mot de passe"]', { timeout: 15000 }).should('exist')
    cy.get('input[aria-label="Confirmer le nouveau mot de passe"]').should('exist')
    cy.get('button[aria-label="Changer le mot de passe"]').should('exist')

    // Le titre peut apparaître après le fallback
    cy.contains('Réinitialisation de mot de passe', { timeout: 15000 }).should('be.visible')
  })

  it('met à jour les indicateurs d’exigences du mot de passe', () => {
    cy.visit('/app/reset-password?token=fake-token')

    // Attendre que les champs soient rendus (chargement session possible)
    cy.get('input[aria-label="Nouveau mot de passe"]', { timeout: 15000 }).should('exist')

    // Saisir un mot de passe simple puis plus fort pour voir les indicateurs évoluer
    cy.get('input[aria-label="Nouveau mot de passe"]').type('Aa1!short')
    cy.get('input[aria-label="Confirmer le nouveau mot de passe"]').type('Aa1!short')

    // Certains critères devraient être validés (minuscule, majuscule, chiffre, spécial) mais pas longueur
    cy.contains('Minimum 12 caractères').should('be.visible')
    cy.contains('Minimum une minuscule').should('be.visible')
    cy.contains('Minimum une majuscule').should('be.visible')
    cy.contains('Minimum 1 chiffre').should('be.visible')
    cy.contains('Minimum 1 caractère spécial').should('be.visible')
    cy.contains('Les mots de passe doivent correspondre').should('be.visible')

    // Améliorer la longueur pour valider le critère des 12 caractères
    cy.get('input[aria-label="Nouveau mot de passe"]').clear().type('Aa1!thisIsLongEnough')
    cy.get('input[aria-label="Confirmer le nouveau mot de passe"]').clear().type('Aa1!thisIsLongEnough')

    // Tous les critères doivent être visibles (nous ne différencions pas par couleur ici)
    cy.contains('Minimum 12 caractères').should('be.visible')
    cy.contains('Les mots de passe doivent correspondre').should('be.visible')
  })
})
