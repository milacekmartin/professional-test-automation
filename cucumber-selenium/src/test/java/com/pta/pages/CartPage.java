package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CartPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By items    = By.cssSelector(".cart_item");
    private final By checkout = By.id("checkout");

    public CartPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public int itemCount() {
        wait.until(d -> d.getCurrentUrl().contains("cart.html") || !d.findElements(items).isEmpty());
        return driver.findElements(items).size();
    }

    public void goToCheckout() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(checkout));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", btn);
        try {
            btn.click();
            wait.until(ExpectedConditions.urlContains("checkout-step-one.html"));
        } catch (TimeoutException | org.openqa.selenium.ElementClickInterceptedException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            wait.until(ExpectedConditions.urlContains("checkout-step-one.html"));
        }
    }
}
