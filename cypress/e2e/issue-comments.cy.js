describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  function clickSaveButtonAndVerify() {
    cy.contains("button", "Cancel").should("be.visible");
    cy.contains("button", "Save")
        .should("be.visible")
        .click()
        .should("not.exist");    
  }

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it.only("Should create, update and delete a comment successfully", () => {
    const comment = "Happy New Year";
    const editComment = "Merry Christmas";

    getIssueDetailsModal().within(() => {
      //ADD d a new comment
      //Assert that the comments field is displayed, click inside the field and type a comment
      cy.contains("Add a comment...").click();
      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      //Assert that Save and Cancel buttons are visible and then save the comment
      //Assert that Save button is not visible anymore
      clickSaveButtonAndVerify();

      //Assert that the added comment is displayed and 2 comments are now visible
      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
      cy.get('[data-testid="issue-comment"]').should("have.length", 2);

      //EDIT the added comment
      //Click on Edit button and assert that it is not displayed after clicking
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");
      //Assert that the previous comment is visible, clear it and type in a new comment
      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", comment)
        .clear()
        .type(editComment);
      //Assert that Save and Cancel buttons are visible and then save the comment
      //Assert that Save button is not visible anymore
      clickSaveButtonAndVerify();
      
      //Assert that the edited comment is displayed
      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", editComment);

      //DELETE the added comment
      //Assert that the Delete button is visible below the comments field and click on it
      cy.get('[data-testid="issue-comment"]').contains("Delete").click();
    });
    //Assert that the delete confirmation dialogue is visible and click on Delete button
    //Assert that Delete button is not visible anymore
    cy.get('[data-testid="modal:confirm"]').should('be.visible')
    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");
    //Assert that the comment has been deleted
    cy.get(getIssueDetailsModal).find(editComment).should("not.exist");
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });
});
