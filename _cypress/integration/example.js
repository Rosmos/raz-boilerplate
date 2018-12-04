describe('Simple sample test', function () {
    it('Visits the Kitchen Sink', function () {
        cy.visit('https://www.sitevision.se/');
        cy.get('.mega-menu a[href="/partners.html"]').click();
        cy.get('#AF + a').click();
        cy.contains('ÅF Digital Solutions');
    });
});
