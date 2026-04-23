package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CheckoutPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By firstName  = By.id("first-name");
    private final By lastName   = By.id("last-name");
    private final By postalCode = By.id("postal-code");
    private final By continueBtn= By.id("continue");
    private final By finishBtn  = By.id("finish");
    private final By error      = By.cssSelector("[data-test='error']");
    private final By confirmMsg = By.cssSelector(".complete-header");

    public CheckoutPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void fillAndContinue(String first, String last, String zip) {
        WebElement fn = wait.until(ExpectedConditions.visibilityOfElementLocated(firstName));
        fn.clear();
        if (first != null && !first.isEmpty()) fn.sendKeys(first);

        WebElement ln = driver.findElement(lastName);
        ln.clear();
        if (last != null && !last.isEmpty()) ln.sendKeys(last);

        WebElement pc = driver.findElement(postalCode);
        pc.clear();
        if (zip != null && !zip.isEmpty()) pc.sendKeys(zip);

        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(continueBtn));
        SafeClick.clickUntil(driver, btn,
                () -> driver.getCurrentUrl().contains("checkout-step-two.html")
                        || !driver.findElements(error).isEmpty());
    }

    public void finish() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(finishBtn));
        SafeClick.clickUntil(driver, btn, () -> driver.getCurrentUrl().contains("checkout-complete.html"));
        wait.until(ExpectedConditions.urlContains("checkout-complete.html"));
    }

    public String errorMessage() {
        return driver.findElements(error).isEmpty() ? "" : driver.findElement(error).getText();
    }

    public String confirmationMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(confirmMsg)).getText();
        } catch (Exception e) {
            return "";
        }
    }
}
