import CommonPage from "./commonPage.js";
class HomePage extends CommonPage {

    constructor() {
        super();
        this.$signUpIcon =() => $(`//a[@id='signin2']`);
        this.$loginIcon =() => $(`//a[@id="login2"]`);
        
    }

    async checkEmailOfLoggedInUser() {
        await this.$nameOfLoggedInUser().waitForDisplayed({timeout: 10000, timeoutMsg: "nameofuser is not displayed"});
        const email = await this.$nameOfLoggedInUser().getText();
        const extractedEmail = email.split(" ")[1];
        return extractedEmail;
    }
    
}
export default new HomePage();