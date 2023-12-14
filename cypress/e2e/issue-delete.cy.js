describe('Issue deletion test', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
    cy.visit(url + '/board');
    cy.contains('This is an issue of type: Task.').click()
    });
  });

  it('Issue Deletion', () => {
  //Click on delete icon and assert that the deletion confirmation window is visible
  cy.get('[data-testid="icon:trash"]').click();
  cy.get('[data-testid="modal:confirm"]').should("be.visible");

  //Click on the delete button
  cy.contains('Delete issue').click();

  //Assert that the issue is deleted and no longer displayed on the Jira board    
  cy.contains('This is an issue of type: Task.').should('not.exist');
});

it('Deletion cancellation', () => {
  //Click on delete icon and assert that the deletion confirmation window is visible
  cy.get('[data-testid="icon:trash"]').click();
  cy.get('[data-testid="modal:confirm"]').should("be.visible");

  //Cancel the deletion in the confirmation window and close the window
  cy.contains('Cancel').click()
  cy.get('[data-testid="modal:issue-details"]').click();
  cy.get('[data-testid="icon:close"]').eq(0).click();

  //Assert that issue is still visible on the Jira board
  cy.reload();
  cy.contains('This is an issue of type: Task.').should('exist');
});
   });