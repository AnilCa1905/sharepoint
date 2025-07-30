import { downloadFile } from "../helpers/download.js";
describe('GIT <-> SHAREPONT',()=> {
       describe('Download Excel File and Upload to Share point', ()=> {
  it('launch url and download excel file', async() => {    
        browser.url('https://fragilestatesindex.org/excel/')
        await browser.maximizeWindow();
        await browser.pause(5000);
        await $(`//b[text()="2023"]/parent::span/parent::a`).waitForClickable();
        await $(`//b[text()="2023"]/parent::span/parent::a`).scrollIntoView();
        await downloadFile(await $(`//b[text()="2023"]/parent::span/parent::a`),'xlsx');
        });
});      
}) ;

