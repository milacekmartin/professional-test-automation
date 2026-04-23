package com.pta.steps;

import com.pta.hooks.DriverFactory;
import io.cucumber.java.en.Then;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;

public class BugSteps {

    @Then("the inventory should contain {int} items")
    public void inventoryShouldContain(int expected) {
        int actual = DriverFactory.get().findElements(By.cssSelector(".inventory_item")).size();
        Assertions.assertEquals(expected, actual,
                "Expected " + expected + " items on the inventory page, got " + actual);
    }
}
