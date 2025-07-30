import CommonPage from "./commonPage.js";

class LoginPage extends CommonPage {
    constructor() {
        super();
        
        this.$loginPageHeader = () => $(`//h5[text()="Log in"]`);
        this.$loginFormFields = (id) =>$(`//input[@id="${id}"]`);
        this.$loginButton = () => $(`//button[text()="Log in"]`);
    }

    async fillLoginForm() {
        const {email, password} = await this.readCredentials();
        await this.$loginFormFields("loginusername").waitForDisplayed({timeout: 10000, timeoutMsg: "loginusername is not displayed"});
        await this.$loginFormFields("loginusername").setValue(email);
        await this.$loginFormFields("loginpassword").setValue(password);
        await this.commonClick(await this.$loginButton(), false, null);
    }
} export default new LoginPage();