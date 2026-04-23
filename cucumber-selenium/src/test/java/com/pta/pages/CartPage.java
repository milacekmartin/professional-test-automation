package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CartPage {

    private final WebDriver driver;

    private final By items      = By.cssSelector(".cart_item");
    private final By checkout   = By.id("checkout");

    public CartPage(WebDriver driver) {
        this.driver = driver;
    }

    public int itemCount() {
        return driver.findElements(items).size();
    }

    public void goToCheckout() {
        driver.findElement(checkout).click();
    }
}
