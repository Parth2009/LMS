package com.lms.Security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.lms.Services.User_Details;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@Component
public class CustomLoginRedirectFilter extends OncePerRequestFilter {

    private String[] paths = {"/login", "/register"};

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        if (Arrays.asList(paths).contains(request.getServletPath())  && request.getUserPrincipal() != null) {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(userDetails != null) {
                // request.getSession().invalidate();
                response.sendRedirect("/LMS/admin");
                return;
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }


}
