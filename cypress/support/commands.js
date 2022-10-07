import 'cypress-localstorage-commands'

// Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
//   cy.contains('Loading ...').should('be.visible')
//   cy.contains('Loading ...').should('not.exist')
// })

Cypress.Commands.add('getFirstStorie', () => {
    cy.get(':nth-child(2) > [style="width: 40%;"] > a')
})