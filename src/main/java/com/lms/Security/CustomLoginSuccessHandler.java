package com.lms.Security;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.lms.Entities.User;
import com.lms.Services.User_Details;

@Component
public class CustomLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		HttpSession session = request.getSession();

		User_Details userDetails = (User_Details) authentication.getPrincipal();
		User user = userDetails.getUser();
		String targetUrl = "/dashboard";


		String user_name = user.getUser_name();
		session.setAttribute("user_name", user_name);		


		if (response.isCommitted()) {
			System.out.println("Response has already been committed. Unable to redirect to "
					+ targetUrl);
			return;
		}

		RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
		redirectStrategy.sendRedirect(request, response, targetUrl);

		super.onAuthenticationSuccess(request, response, authentication);

	}

}