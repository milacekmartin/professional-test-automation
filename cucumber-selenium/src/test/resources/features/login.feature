@smoke @login
Feature: User login
  As a SauceDemo customer
  I want to log in to my account
  So that I can browse products and place orders

  Background:
    Given I am on the login page

  @positive @demo_login_valid
  Scenario: Successful login with valid credentials
    When I log in as "standard_user" with password "secret_sauce"
    Then I should see the products page
    And the page title should contain "Swag Labs"

  @positive
  Scenario Outline: Login works for all valid user roles
    When I log in as "<user>" with password "secret_sauce"
    Then I should see the products page

    Examples:
      | user             |
      | standard_user    |
      | problem_user     |
      | performance_glitch_user |

  @negative @demo_login_negative
  Scenario: Locked-out user cannot log in
    When I log in as "locked_out_user" with password "secret_sauce"
    Then I should see an error message containing "locked out"
    And I should remain on the login page

  @negative
  Scenario: Invalid password is rejected
    When I log in as "standard_user" with password "wrong_password"
    Then I should see an error message containing "do not match"
    And I should remain on the login page

  @negative
  Scenario: Empty username is rejected
    When I log in as "" with password "secret_sauce"
    Then I should see an error message containing "Username is required"
    And I should remain on the login page
