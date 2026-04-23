package com.pta.hooks;

import io.cucumber.java.After;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class Hooks {

    @After
    public void tearDown(Scenario scenario) {
        WebDriver d = DriverFactory.get();
        if (scenario.isFailed() && d instanceof TakesScreenshot ts) {
            byte[] png = ts.getScreenshotAs(OutputType.BYTES);
            scenario.attach(png, "image/png", "failure-screenshot");
        }
        DriverFactory.quit();
    }
}
