package com.lms.Security;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class CustomErrorPageConfig {

    @Bean
    public ErrorPageRegistrar errorPageRegistrar() {
        return new MyErrorPageRegistrar();
    }

    private static class MyErrorPageRegistrar implements ErrorPageRegistrar {

        @Override
        public void registerErrorPages(ErrorPageRegistry registry) {
            // Configure custom error pages here
            registry.addErrorPages(
                new ErrorPage(HttpStatus.NOT_FOUND, "/error-404"),
                new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error-500")
            );
        }
    }
}
