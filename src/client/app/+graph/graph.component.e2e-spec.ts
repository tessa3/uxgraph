describe('Graph', () => {

  beforeEach( () => {
    browser.get('/graph');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-graph h2')).getText()).toEqual('Features');
  });

});
