const username = `User${Date.now()}`;
const email = `user${Date.now()}@serverest.com`;
const password = 'pass123';

Cypress.Commands.add('registerNewUser', () => {
    cy.visit(Cypress.env('frontBaseUrl') + '/login');
    cy.get("[data-testid='cadastrar']")
        .should('be.visible')
        .click();
    cy.get('[data-testid="nome"]')
        .should('be.visible')
        .type(username);
    cy.get('[data-testid="email"]')
        .should('be.visible')
        .type(email);
    cy.get('[data-testid="password"]')
        .should('be.visible')
        .type(password, {log: false});
    cy.get('[data-testid="cadastrar"]')
        .should('be.visible')
        .click();
    cy.get('.alert-link')
        .should('be.visible')
        .should('have.text', 'Cadastro realizado com sucesso');
    cy.get('[data-testid="logout"]')
        .should('be.visible')
        .should('have.text', 'Logout')
        .click();
});

Cypress.Commands.add('login', () => {
    cy.visit(Cypress.env('frontBaseUrl') + '/login');
    cy.get('[data-testid="email"]')
        .should('be.visible')
        .type(email);
    cy.get('[data-testid="senha"]')
        .should('be.visible')
        .type(password, {log: false});
    cy.get('[data-testid="entrar"]')
        .should('be.visible')
        .click();
    cy.url().should('include', '/login');
});

Cypress.Commands.add('signupAndGetToken', () => {
    const username = `User${Date.now()}`;
    const email = `user${Date.now()}@serverest.com`;
    const password = 'pass12345';
    cy.request({
        method: 'POST',
        url: '/usuarios',
        body: {
            nome: username,
            email: email,
            password: password,
            administrador: 'true'
        }
    }).then((signup) => {
        expect(signup.status).to.eq(201);
        Cypress.env('userId', signup.body._id);
        expect(signup.body.message).to.eq('Cadastro realizado com sucesso');
    });

    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            email: email,
            password: password
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        const authToken = response.body.authorization;
        Cypress.env('authToken', authToken);
    });
});

Cypress.Commands.add('deleteUserById', () => {
    const authToken = Cypress.env('authToken');
    const id = Cypress.env('userId');
    expect(authToken, 'Authentication token not found').to.exist;

    cy.request({
        method: 'DELETE',
        url: `/usuarios/${id}`,
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
    });
});




