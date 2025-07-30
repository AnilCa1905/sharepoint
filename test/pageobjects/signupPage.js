import CommonPage from "./commonPage.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class SignupPage extends CommonPage {
    constructor() {
        super();
        this.$signupPageHeader = () => $(`//h5[text()="Sign up"]`);
        this.$$signUpFormTextFields = () => $$(`//div[@role="document"]/parent::div[@aria-labelledby="signInModalLabel"]//input`);
        this.$signUpButton = () => $(`//button[@onclick="register()"]`);
    }

    async fillSignupForm() {
        let signupCredentials = await this.generateCredentials();
        let textFields = await this.$$signUpFormTextFields();

        for (let i = 0; i < textFields.length; i++) {
            await textFields[i].setValue(signupCredentials[i]);
        }

        const credentialData = {
            email: signupCredentials[0],
            password: signupCredentials[1]
        };

        const jsonData = JSON.stringify(credentialData, null, 2);

        // Define __dirname for ES modules
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, '../test-data/credentials.json');

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, jsonData);

        let alertPopped = false;
        await this.commonClick(await this.$signUpButton(), true, await this.$brandLogo());

        if (await browser.isAlertOpen()) {
            await browser.acceptAlert(); 
            alertPopped = true;
        }

        // return alertPopped;
    }
}

export default new SignupPage();
