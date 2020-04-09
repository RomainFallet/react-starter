describe('feature CatsList', () => {
  it('displays all the cats', () => {
    // Act
    cy.visit('/')

    // Assert
    cy.findAllByAltText('Cat').should('have.length', 5)
  })

  it('displays new cats after hitting reload button', () => {
    // Arrange
    cy.visit('/')

    // Act
    cy.findByText('I want new cats!').click()

    // Assert
    cy.findAllByAltText('Cat').should('have.length', 5)
  })
})
