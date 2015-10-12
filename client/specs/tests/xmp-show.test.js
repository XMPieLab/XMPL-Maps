describe('xmp-show directive', function(){

    beforeEach(function(){
        browser.get('http://localhost:9080/specs/views/xmp-show.html?rid=Yaron.Tomer');
        browser.waitForAngular();
    });

    it('is visible', function(){
        var e = element.all(by.css('div')).get(0),
            button = element.all(by.css('button')).get(0);

        expect(e.isDisplayed()).toBe(false);
        button.click();
        expect(e.isDisplayed()).toBe(true);
        button.click();
        expect(e.isDisplayed()).toBe(false);
    })
});