describe('Personolized Page', function(){
    var divs = element.all(by.css('div'));

    beforeEach(function(){
        browser.get("http://localhost:9080/specs/views/personalized-page.html?rid=yaron.tomer");
    });

    it('first name field in place', function(){
        browser.waitForAngular();
        var e = divs.get(0);
        expect(e.getText()).toBe('Yaron');
    });

    it('last name field in place', function(){
        browser.waitForAngular();
        var e = divs.get(1);
        expect(e.getText()).toBe('Tomer');
    });

    it('gender field in place', function(){
        browser.waitForAngular();
        var e = divs.get(2);
        expect(e.getText()).toBe('M');
    });

});