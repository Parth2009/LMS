package com.lms.Services;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import com.lms.Entities.User;
import com.lms.Repository.UserRepository;

@Component
public class User_DetailsService implements UserDetailsService {

    @Autowired
    HttpServletRequest request;
    @Autowired
    JdbcTemplate template;
    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("unused")
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findFirstByUserName(username);

        // String status = user.getStatus();

        User_Details userDetails = null;
        if (user != null) {
            String status = user.getStatus();

            if (status.equals("1")) {
                userDetails = new User_Details();
                userDetails.setUser(user);
            } else {
                throw new UsernameNotFoundException("User is not active");
            }

        } else {
            throw new UsernameNotFoundException("User not exist with this name : " + username);
        }
        return userDetails;
    }

}