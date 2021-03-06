import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getLogoText() {
    return element(by.css('uxg-app .logo')).getText() as Promise<string>;
  }
}
