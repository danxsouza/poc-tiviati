describe('Validating Request', () => {
    context('GET /usuarios', () => {
        it('Should test with a valid token saved', () => {
            cy.signupAndGetToken();
            cy.request({
                method: 'GET',
                url: 'https://serverest.dev/usuarios',
                headers: {
                    Authorization: Cypress.env('authToken')
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        it('Should return a list with all users and validate keys', () => {
            cy.request({
                method: 'GET',
                url: '/usuarios',
                headers: {
                    accept: 'application/json',
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.usuarios[0]).to.have.all.keys(
                    'nome', 'email', 'password', 'administrador', '_id'
                )
            });
        });

        it('Should validate if an api contains the correct key and value', () => {
            cy.request({
                method: 'GET',
                url: '/usuarios',
                headers: {
                    accept: 'application/json',
                }
            }).then(response => {
                let body = JSON.parse(JSON.stringify(response.body));
                expect(response.status).to.eq(200);
                expect(body).to.have.property('usuarios');
            });
        });
    });

    context('POST and PUT /usuarios', () => {
        let userId;
        before(() => {
            cy.request({
                method: 'POST',
                url: '/usuarios',
                body: {
                    nome: "Usuário Teste",
                    email: `usuario${Date.now()}@qa.com.br`,
                    password: "teste",
                    administrador: "true"
                }
            }).then(response => {
                expect(response.status).to.eq(201);
                userId = response.body._id;
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
            });
        });

        context('PUT /usuarios/{_id}', () => {
            it('Should update the user data and validate the response', () => {
                const updatedUser = {
                    nome: "Usuário Alterado",
                    email: `usuario_alterado${Date.now()}@qa.com.br`,
                    password: "novaSenha",
                    administrador: "false"
                };
                cy.request({
                    method: 'PUT',
                    url: `/usuarios/${userId}`,
                    body: updatedUser
                }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.body.message).to.eq('Registro alterado com sucesso');
                });

                cy.request({
                    method: 'GET',
                    url: `/usuarios/${userId}`
                }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.body.nome).to.eq(updatedUser.nome);
                    expect(response.body.email).to.eq(updatedUser.email);
                    expect(response.body.administrador).to.eq(updatedUser.administrador);
                });
            });
        });
    });

    context('DELETE /usuarios/{_id}', () => {
        it('Should delete a user by their id', () => {
            cy.signupAndGetToken();
            cy.deleteUserById(Cypress.env('userId'));
            cy.request({
                method: 'DELETE',
                url: `https://serverest.dev/usuarios/${Cypress.env('userId')}`,
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(200);
            });
        });
    });
});







