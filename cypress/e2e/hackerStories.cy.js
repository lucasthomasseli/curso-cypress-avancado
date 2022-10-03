describe('Hacker Stories', () => {
  beforeEach(() => {

    cy.intercept({
       method: 'GET',
       pathname: '**/v1/search',
       query: {
         query: 'React',
          page: '0'
        },
    }).as('getStories')
    
    cy.visit('/')

    cy.wait('@getStories')

    cy.contains('More').should('be.visible')
  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {

    it.skip('shows the right data for all rendered stories', () => {})

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.get('.item').should('have.length', 20)

      cy.intercept({
        method: 'GET',
        pathname: '**/v1/search',
        query: {
          query: 'React',
          page: '1'
        },
      }).as('getNextStories')

      cy.contains('More').click()

      cy.wait('@getNextStories')

      cy.get('.item').should('have.length', 40)
    })

    it('shows only nineteen stories after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })
    
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {

      cy.intercept({
        method: 'GET',
        pathname: '**/v1/search',
        query: {
          query: newTerm,
          page: '0'
          },
        }).as('getNewTermStories')

      cy.get('#search')
        .clear()
    })

    it('types and hits ENTER', () => {
    
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.wait('@getNewTermStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {

      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.wait('@getNewTermStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('searches via the last searched term', () => {

        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@getNewTermStories')

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.wait('@getStories')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('shows a max of 5 buttons for the last searched terms', () => {
        const faker = require('faker-br')

        cy.intercept({
          method: 'GET',
          pathname: '**/v1/search'
          }).as('getRandomStories')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${faker.random.word()}{enter}`)
          
          cy.wait('@getRandomStories')
        })

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})

context('Errors', () => {

  const errorMsg = 'Something went wrong ...'

  it('shows "Something went wrong ..." in case of a server error', () => {

    cy.intercept(
      'GET',
      'search?query=cypress&page=0',
      { statusCode: 500 }
    ).as('getServerFailure')

    cy.visit('/')

    cy.get('#search')
      .clear()
      .type('cypress{enter}')

    cy.wait('@getServerFailure')

    cy.contains(errorMsg)
      .should('be.visible')
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    
    cy.intercept(
      'GET',
      'search?query=cypress&page=0',
      { forceNetworkError: true }
    ).as('getNetworkFailure')

    cy.visit('/')

    cy.get('#search')
      .clear()
      .type('cypress{enter}')

    cy.wait('@getNetworkFailure')

    cy.contains(errorMsg)
      .should('be.visible')
  })
})