package com.lms.Security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.lms.Entities.User;
import com.lms.Repository.UserRepository;

@Component
public class CustomLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private UserRepository userRepo;
    String msg;

    @SuppressWarnings("unlikely-arg-type")
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        HttpSession session = request.getSession();

        String user_name = request.getParameter("user_name");
        User user = userRepo.findFirstByUserName(user_name);

        // --------------------------

        if (user != null) {
            String user_entered_pass = request.getParameter("password");
            String txtpass = user.getPassword_txt();
            System.out.println("pass::::" + user_entered_pass);

            if (user.getStatus().equals("1") && !txtpass.contentEquals(user_entered_pass)) {
                exception = new LockedException("Please enter valid Password!");
            } else {
                exception = new LockedException("Your Account is not active");
            }

        }

        super.setDefaultFailureUrl("/login?error");
        super.onAuthenticationFailure(request, response, exception);
    }

}