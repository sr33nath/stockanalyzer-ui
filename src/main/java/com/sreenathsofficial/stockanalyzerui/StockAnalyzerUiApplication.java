package com.sreenathsofficial.stockanalyzerui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@EnableZuulProxy
@SpringBootApplication
public class StockAnalyzerUiApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(StockAnalyzerUiApplication.class, args);
    }
}