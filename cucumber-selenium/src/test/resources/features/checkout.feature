@smoke @checkout
Feature: Shopping cart and checkout
  As a logged-in customer
  I want to add products to my cart and complete an order
  So that I can purchase items

  Background:
    Given I am logged in as "standard_user"

  @positive @demo_cart
  Scenario: Add a single product and complete checkout
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    Then the cart should contain 1 item
    When I proceed to checkout with "Martin" "Milacek" zip "84104"
    And I finish the order
    Then I should see a confirmation containing "Thank you for your order"

  @positive
  Scenario: Add multiple products and see correct count
    When I add the following products to the cart:
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Bolt T-Shirt  |
    And I open the cart
    Then the cart should contain 3 items

  @negative @demo_checkout_negative
  Scenario: Checkout form rejects missing last name
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I proceed to checkout with "Martin" "" zip "84104"
    Then I should see an error message containing "Last Name is required"

  @negative
  Scenario: Checkout form rejects missing zip code
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I proceed to checkout with "Martin" "Milacek" zip ""
    Then I should see an error message containing "Postal Code is required"
