package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class InventoryPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By title      = By.cssSelector(".title");
    private final By cartBadge  = By.cssSelector(".shopping_cart_badge");
    private final By cartLink   = By.cssSelector(".shopping_cart_link");

    public InventoryPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public boolean isLoaded() {
        try {
            wait.until(ExpectedConditions.textToBePresentInElementLocated(title, "Products"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void addToCart(String productName) {
        // Wait for the inventory grid to render before trying to click a specific item
        wait.until(ExpectedConditions.visibilityOfElementLocated(title));
        String xpath = String.format(
                "//div[contains(@class,'inventory_item')]" +
                "[.//div[contains(@class,'inventory_item_name') and normalize-space()='%s']]" +
                "//button[contains(@class,'btn_inventory')]",
                productName);
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpath)));
        btn.click();
    }

    public int cartCount() {
        List<WebElement> b = driver.findElements(cartBadge);
        return b.isEmpty() ? 0 : Integer.parseInt(b.get(0).getText().trim());
    }

    public void openCart() {
        WebElement link = wait.until(ExpectedConditions.elementToBeClickable(cartLink));
        link.click();
        // Wait until URL navigates to cart
        wait.until(d -> d.getCurrentUrl().contains("cart.html"));
    }
}
