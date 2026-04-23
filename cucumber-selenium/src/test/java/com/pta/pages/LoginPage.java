package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    public static final String URL = "https://www.saucedemo.com/";

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By username = By.id("user-name");
    private final By password = By.id("password");
    private final By loginBtn = By.id("login-button");
    private final By error    = By.cssSelector("[data-test='error']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public LoginPage open() {
        driver.get(URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(username));
        return this;
    }

    public LoginPage login(String user, String pass) {
        WebElement u = wait.until(ExpectedConditions.visibilityOfElementLocated(username));
        u.clear();
        if (user != null && !user.isEmpty()) u.sendKeys(user);

        WebElement p = driver.findElement(password);
        p.clear();
        if (pass != null && !pass.isEmpty()) p.sendKeys(pass);

        driver.findElement(loginBtn).click();
        return this;
    }

    public String errorMessage() {
        return driver.findElements(error).isEmpty() ? "" : driver.findElement(error).getText();
    }

    public boolean isOnLoginPage() {
        String url = driver.getCurrentUrl();
        return url.equals(URL) || url.endsWith("/") || url.endsWith("saucedemo.com/");
    }
}
