@bug
Feature: Intentional bug demo
  Demonstrates what a regression looks like in the report.

  Scenario: Demo regression — product count mismatch
    Given I am logged in as "standard_user"
    Then the inventory should contain 42 items
