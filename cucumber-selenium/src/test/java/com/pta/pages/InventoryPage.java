package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class InventoryPage {

    private final WebDriver driver;

    private final By title      = By.cssSelector(".title");
    private final By cartBadge  = By.cssSelector(".shopping_cart_badge");
    private final By cartLink   = By.cssSelector(".shopping_cart_link");

    public InventoryPage(WebDriver driver) {
        this.driver = driver;
    }

    public boolean isLoaded() {
        return !driver.findElements(title).isEmpty()
                && driver.findElement(title).getText().equalsIgnoreCase("Products");
    }

    public void addToCart(String productName) {
        // Find product by name, then its "Add to cart" button in same card
        String xpath = String.format(
                "//div[contains(@class,'inventory_item')]" +
                "[.//div[contains(@class,'inventory_item_name') and normalize-space()='%s']]" +
                "//button[contains(@class,'btn_inventory')]",
                productName);
        WebElement btn = driver.findElement(By.xpath(xpath));
        btn.click();
    }

    public int cartCount() {
        List<WebElement> b = driver.findElements(cartBadge);
        return b.isEmpty() ? 0 : Integer.parseInt(b.get(0).getText().trim());
    }

    public void openCart() {
        driver.findElement(cartLink).click();
    }
}
