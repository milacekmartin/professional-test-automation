package com.pta.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.function.BooleanSupplier;

final class SafeClick {

    private SafeClick() {}

    static void click(WebDriver driver, WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", element);
        try {
            element.click();
        } catch (org.openqa.selenium.ElementClickInterceptedException | org.openqa.selenium.StaleElementReferenceException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    static void clickUntil(WebDriver driver, WebElement element, BooleanSupplier condition) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", element);
        try {
            element.click();
        } catch (Exception ignored) {}
        if (waitFor(condition, 3000)) return;
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        waitFor(condition, 7000);
    }

    private static boolean waitFor(BooleanSupplier c, long ms) {
        long end = System.currentTimeMillis() + ms;
        while (System.currentTimeMillis() < end) {
            try { if (c.getAsBoolean()) return true; } catch (Exception ignored) {}
            try { Thread.sleep(200); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); return false; }
        }
        return false;
    }
}
