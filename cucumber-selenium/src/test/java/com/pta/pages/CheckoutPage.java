package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage {

    private final WebDriver driver;

    private final By firstName  = By.id("first-name");
    private final By lastName   = By.id("last-name");
    private final By postalCode = By.id("postal-code");
    private final By continueBtn= By.id("continue");
    private final By finishBtn  = By.id("finish");
    private final By error      = By.cssSelector("[data-test='error']");
    private final By confirmMsg = By.cssSelector(".complete-header");

    public CheckoutPage(WebDriver driver) {
        this.driver = driver;
    }

    public void fillAndContinue(String first, String last, String zip) {
        driver.findElement(firstName).clear();
        if (first != null && !first.isEmpty()) driver.findElement(firstName).sendKeys(first);
        driver.findElement(lastName).clear();
        if (last != null && !last.isEmpty()) driver.findElement(lastName).sendKeys(last);
        driver.findElement(postalCode).clear();
        if (zip != null && !zip.isEmpty()) driver.findElement(postalCode).sendKeys(zip);
        driver.findElement(continueBtn).click();
    }

    public void finish() {
        driver.findElement(finishBtn).click();
    }

    public String errorMessage() {
        return driver.findElements(error).isEmpty() ? "" : driver.findElement(error).getText();
    }

    public String confirmationMessage() {
        return driver.findElements(confirmMsg).isEmpty() ? "" : driver.findElement(confirmMsg).getText();
    }
}
