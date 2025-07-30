import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
export default class CommonPage {
    constructor(){
        this.$brandLogo =()=> $(`//a[@class="navbar-brand"]/img`);
        this.$nameOfLoggedInUser = ()=> $(`//a[@id="nameofuser"]`);
    }

    async loadUrl(){
        await browser.maximizeWindow();
        await browser.url("https://www.demoblaze.com/");
    }

    async commonClick(element, needToWait, elementToWait){
        await element.scrollIntoView();
        if(needToWait === true && elementToWait){
            await element.click();
            await browser.pause(2000);
            await elementToWait.waitForDisplayed({timeout: 10000, timeoutMsg: "Element is not displayed"});
        } else {
            await element.click();
        }
    }

    async generateRandomNumber(){
        return Math.floor(Math.random() * 10000);
    }

    async generateRandomEmail(){
        const randomNumber = await this.generateRandomNumber();
        return `test${randomNumber}@gmail.com`;
    }

    async generateRandomPassword(){
        const randomNumber = await this.generateRandomNumber();
        return `test${randomNumber}`;
    }

    async generateCredentials(){
        const randomNumber = await this.generateRandomPassword();
        let randomEmail = `test${randomNumber}@gmail.com`;
        let generateRandomPassword = `test${randomNumber}`;
        return [randomEmail, generateRandomPassword];
    }

    readCredentials() {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, '../test-data/credentials.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }

    async reportRequestDetails(request) {
        
        console.log(`Captured Request: ${request.url}`);
        console.log(`Method: ${request.method}`);
        console.log(`Response Code: ${request.response?.status}`);

        
        allure.addStep(`API Request: ${request.url}`, {
            content: JSON.stringify({
                method: request.method,
                status: request.response?.status,
                requestBody: request.postData,
                responseBody: request.response?.body,
            }, null, 2),
            name: `API Request: ${request.url}`,
            type: 'application/json'
        });
    }
}