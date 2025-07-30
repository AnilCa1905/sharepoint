describe('Handling Multiple Windows switching to child window and then switching to parent window back',()=> {

        it('should make switching from parent to child and child to parent window', async() => {    
        browser.url('https://www.booking.com/')
        await browser.maximizeWindow();
        
        let parentWindow = await browser.getWindowHandle();
        await browser.pause(5000);
        (await $(`//h3[text()="Munnar"]`)).waitForClickable();
        await $(`//h3[text()="Munnar"]`).scrollIntoView();
        await $(`//h3[text()="Munnar"]`).click();
        (await $(`//h3[text()="Thekkady"]`)).waitForClickable();
        await $(`//h3[text()="Thekkady"]`).scrollIntoView();
        await $(`//h3[text()="Thekkady"]`).click();
        (await $(`//h3[text()="Ooty"]`)).waitForClickable();
        await $(`//h3[text()="Ooty"]`).scrollIntoView();
        await $(`//h3[text()="Ooty"]`).click();
        
        let ID = await browser.getWindowHandles()
           for(let i = 0; i< ID.length; i++)
            {
                 if( ID[i]!= parentWindow)
                    {
                       await browser.switchToWindow(ID[i]);
                       await browser.pause(5000);
                       await browser.closeWindow();
                    }
           }
        await browser.switchToWindow(parentWindow);
        await browser.pause(5000);
        });

        it('New Window', async () => {
                await browser.newWindow('https://www.google.com/');
                await browser.pause(5000);
        });
        /**
         * git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/AnilCa1905/sharepoint.git
git push -u origin main
         */
});

