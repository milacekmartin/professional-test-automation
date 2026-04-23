package com.pta.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

    public static final String URL = "https://www.saucedemo.com/";

    private final WebDriver driver;

    private final By username = By.id("user-name");
    private final By password = By.id("password");
    private final By loginBtn = By.id("login-button");
    private final By error    = By.cssSelector("[data-test='error']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public LoginPage open() {
        driver.get(URL);
        return this;
    }

    public LoginPage login(String user, String pass) {
        driver.findElement(username).clear();
        if (user != null && !user.isEmpty()) driver.findElement(username).sendKeys(user);
        driver.findElement(password).clear();
        if (pass != null && !pass.isEmpty()) driver.findElement(password).sendKeys(pass);
        driver.findElement(loginBtn).click();
        return this;
    }

    public String errorMessage() {
        return driver.findElements(error).isEmpty() ? "" : driver.findElement(error).getText();
    }

    public boolean isOnLoginPage() {
        return driver.getCurrentUrl().equals(URL) || driver.getCurrentUrl().endsWith("/");
    }
}
