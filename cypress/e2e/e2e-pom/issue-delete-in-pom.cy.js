import IssueModal from "../../pages/IssueModal";

describe('Issue deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //open issue detail modal with title from line 13  
    cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {
    //Click on delete icon and assert that the deletion confirmation window is visible
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    //Assert that the issue is no longer displayed on the Jira board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)
  });

  it('Should cancel deletion process successfully', () => {
    //Click on delete icon and assert that the deletion confirmation window is visible
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal()

    //Assert that issue is still visible on the Jira board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)

  });
});