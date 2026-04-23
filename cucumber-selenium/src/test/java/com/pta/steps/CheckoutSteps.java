package com.pta.steps;

import com.pta.hooks.DriverFactory;
import com.pta.pages.CartPage;
import com.pta.pages.CheckoutPage;
import com.pta.pages.InventoryPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.datatable.DataTable;
import org.junit.jupiter.api.Assertions;

import java.util.List;

public class CheckoutSteps {

    private final InventoryPage inventory = new InventoryPage(DriverFactory.get());
    private final CartPage cart = new CartPage(DriverFactory.get());
    private final CheckoutPage checkout = new CheckoutPage(DriverFactory.get());

    @When("I add {string} to the cart")
    public void add_product(String name) {
        inventory.addToCart(name);
    }

    @When("I add the following products to the cart:")
    public void add_products(DataTable table) {
        List<String> names = table.asList();
        names.forEach(inventory::addToCart);
    }

    @And("I open the cart")
    public void open_cart() {
        inventory.openCart();
    }

    @Then("the cart should contain {int} item")
    public void cart_should_contain_one(int expected) {
        Assertions.assertEquals(expected, cart.itemCount(),
                "Expected " + expected + " item(s) in cart, got " + cart.itemCount());
    }

    @Then("the cart should contain {int} items")
    public void cart_should_contain_many(int expected) {
        Assertions.assertEquals(expected, cart.itemCount(),
                "Expected " + expected + " items in cart, got " + cart.itemCount());
    }

    @When("I proceed to checkout with {string} {string} zip {string}")
    public void checkout_with(String first, String last, String zip) {
        cart.goToCheckout();
        checkout.fillAndContinue(first, last, zip);
    }

    @And("I finish the order")
    public void finish_order() {
        checkout.finish();
    }

    @Then("I should see a confirmation containing {string}")
    public void confirmation_should_contain(String expected) {
        String actual = checkout.confirmationMessage();
        Assertions.assertTrue(actual.toLowerCase().contains(expected.toLowerCase()),
                "Expected confirmation containing '" + expected + "', got: '" + actual + "'");
    }
}
