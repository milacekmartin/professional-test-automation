package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
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
        // Wait for the checkout button to be present and clickable — the cart page
        // may still be rendering after navigation.
        wait.until(ExpectedConditions.elementToBeClickable(checkout)).click();
    }
}
