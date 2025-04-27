describe('First Signup & Login - Product in Cart Validation', () => {
    before(() => {
        cy.registerNewUser();
    });

    context('Validating a valid and invalid login', () => {
        it('Should validate if it is a valid login', () => {
            cy.login();
        });

        it('Should validate if it is an invalid login', () => {
            cy.visit(Cypress.env('frontBaseUrl') + '/login');
            cy.get('[data-testid="email"]').type("wronguser@serverest.com");
            cy.get('[data-testid="senha"]').type('wrongpass', { log: false });
            cy.get('[data-testid="entrar"]').click();
            cy.get('.alert').should('be.visible').should('have.text', '×Email e/ou senha inválidos');
        });
    });

    context('Validating the product list', () => {
        it('Should search for the product in the list and display it', () => {
            cy.login();
            cy.get('.card-body')
                .first()
                .find('h5')
                .invoke('text')
                .then((product) => {
                    cy.get('[data-testid="pesquisar"]')
                        .should('be.visible')
                        .type(product);
                });
            cy.get('[data-testid="botaoPesquisar"]')
                .should('be.visible')
                .and('have.text', 'Pesquisar  ')
                .click();

            cy.get('.card-body')
                .first()
                .find('h5')
                .invoke('text')
                .then((product) => {
                    cy.get('.card-title').should('have.text', product);
                });
        });

        it('Should add a product to cart', () => {
            cy.login();
            cy.get('.card-body').first().click();
            cy.get('[data-testid="adicionarNaLista"]').first().click();
            cy.get('[data-testid="product-increase-quantity"]').click();
            cy.get('[data-testid="adicionar carrinho"]').click();
        });

        it('Should clean the product in the cart', () => {
            cy.login();
            cy.get('.card-body').first().click();
            cy.get('[data-testid="adicionarNaLista"]').first().click();
            cy.get('[data-testid="product-increase-quantity"]').click();
            cy.get('[data-testid="limparLista"]').click();
            cy.get('[data-testid="shopping-cart-empty-message"]').should('be.visible').and('have.text', 'Seu carrinho está vazio');
        });
    });

    context('Validating the headers', () => {
        it('Should validate if links on the headers are available', () => {
            cy.login();
            cy.get('[data-testid="home"]').should('have.text', 'Home');
            cy.url().should('eq', 'https://front.serverest.dev/home');

            cy.get('[data-testid="lista-de-compras"]').click()
            cy.get('[data-testid="lista-de-compras"]').should('have.text', 'Lista de Compras');
            cy.url().should('eq', 'https://front.serverest.dev/minhaListaDeProdutos');

            cy.get('[data-testid="carrinho"]').click();
            cy.get('[data-testid="carrinho"]').should('have.text', 'Carrinho');
            cy.url().should('eq', 'https://front.serverest.dev/carrinho');
        });
    });
});