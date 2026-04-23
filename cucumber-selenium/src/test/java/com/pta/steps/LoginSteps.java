package com.pta.steps;

import com.pta.hooks.DriverFactory;
import com.pta.pages.InventoryPage;
import com.pta.pages.LoginPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.java.en.And;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginSteps {

    private LoginPage loginPage;
    private InventoryPage inventoryPage;

    @Given("I am on the login page")
    public void i_am_on_login_page() {
        WebDriver d = DriverFactory.get();
        loginPage = new LoginPage(d).open();
        inventoryPage = new InventoryPage(d);
    }

    @Given("I am logged in as {string}")
    public void i_am_logged_in_as(String user) {
        WebDriver d = DriverFactory.get();
        loginPage = new LoginPage(d).open();
        loginPage.login(user, "secret_sauce");
        inventoryPage = new InventoryPage(d);
        Assertions.assertTrue(inventoryPage.isLoaded(), "Expected inventory page after login");
    }

    @When("I log in as {string} with password {string}")
    public void i_log_in_as(String user, String pass) {
        loginPage.login(user, pass);
    }

    @Then("I should see the products page")
    public void i_should_see_products_page() {
        Assertions.assertTrue(inventoryPage.isLoaded(), "Inventory page not loaded");
    }

    @And("the page title should contain {string}")
    public void title_should_contain(String expected) {
        String actual = DriverFactory.get().getTitle();
        Assertions.assertTrue(actual.contains(expected),
                "Title '" + actual + "' does not contain '" + expected + "'");
    }

    /**
     * Shared across login & checkout — both use data-test='error'.
     */
    @Then("I should see an error message containing {string}")
    public void error_should_contain(String expected) {
        WebDriver d = DriverFactory.get();
        var errors = d.findElements(By.cssSelector("[data-test='error']"));
        String actual = errors.isEmpty() ? "" : errors.get(0).getText();
        Assertions.assertTrue(actual.toLowerCase().contains(expected.toLowerCase()),
                "Expected error containing '" + expected + "', got: '" + actual + "' (URL=" + d.getCurrentUrl() + ")");
    }

    @And("I should remain on the login page")
    public void should_remain_on_login() {
        Assertions.assertTrue(loginPage.isOnLoginPage(),
                "Expected to still be on login page; URL=" + DriverFactory.get().getCurrentUrl());
    }
}
