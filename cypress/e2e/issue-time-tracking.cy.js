describe("Issue time estimation and logging functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  function closeIssueDetailsModal() {
    cy.get('[data-testid="icon:close"]').eq(0).click();
  }
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const stopWatchIcon = () => cy.get('[data-testid="icon:stopwatch"]');
  const timeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const getNumberHours = () => cy.get('[placeholder="Number"]');

  it("Should add, edit, delete time estimation and log and remove logged time in the issue", () => {
    getIssueDetailsModal().within(() => {
      //Assert that the time estimation function exists
      cy.contains("Original Estimate (hours)").should("exist");

      //ADD estimation and assert that it is visible
      getNumberHours().should("be.visible").click().clear().type("10");
      cy.contains("10h estimated").should("be.visible");
      //Close issue details modal
      closeIssueDetailsModal();
    });
    //Reopen the same issue to check that the original estimation is saved
    cy.contains("This is an issue of type: Task.").click();
    cy.contains("10h estimated").should("be.visible");

    //UPDATE estimation and assert that is is visible
    getNumberHours().should("be.visible").click().clear().type("20");
    cy.contains("20h estimated").should("be.visible");
    //Close issue details modal
    closeIssueDetailsModal();
    //Reopen the same issue to check that the original estimation is saved
    cy.contains("This is an issue of type: Task.").click();
    cy.contains("20h estimated").should("be.visible");

    //REMOVE estimation
    getNumberHours().should("be.visible").click().clear();
    //Close issue details modal
    closeIssueDetailsModal();
    //Reopen the same issue to check that no time estimation exists
    cy.contains("This is an issue of type: Task.").click();
    cy.contains("20h estimated").should("not.exist");

    //LOG TIME
     //Assert that the stopwatch icon is visible and click on it
    stopWatchIcon().should("be.visible").click();
    //Assert that the time tracking pop-up dialogue is visible
    //Enter value 2 to the field "Time spent" and value 5 to the field "Time remaining"
    //Click on Done button and assert that this button does not exist anymore
    timeTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)");
        getNumberHours().eq(0).click().clear().type(2);
        cy.contains("Time remaining (hours)");
        getNumberHours().eq(1).click().clear().type(5);
        cy.contains("button", "Done").click().should("not.exist");
      });

    //Assert that the logged time is added and visible
    getIssueDetailsModal().within(() => {
      cy.contains("div", "2h logged").should("be.visible");
      cy.contains("div", "5h remaining").should("be.visible");
    });

    //REMOVE LOGGED time
    //Click on the time tracking section
    stopWatchIcon().click();
    //Assert that the time tracking pop-up dialogue is visible
    //Remove values from the fields "Time spent” and "Time remaining"
    //Click on Done button and assert that this button does not exist anymore
    timeTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)");
        getNumberHours().eq(0).clear();
        cy.contains("Time remaining (hours)");
        getNumberHours().eq(1).clear();
        cy.contains("button", "Done").click().should("not.exist");
      });

    //Assert that value is removed from the time tracking section
    getIssueDetailsModal().within(() => {
      cy.contains("2h logged").should("not.exist");
      cy.contains("5h remaining").should("not.exist");
      cy.contains("No time logged").should("exist");
    });
  });
});
