package com.lms.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.TimeZone;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lms.Entities.User;
import com.lms.Entities.UserLeaves;
import com.lms.Repository.UserLeavesRepo;
import com.lms.Repository.UserRepository;
import com.lms.Services.LeaveManagementService;

@Controller
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserLeavesRepo userLeavesRepo;

    @GetMapping("/dashboard")
    public String admin(Principal Name, ModelMap modal) {
        // System.out.println(Name.getName());
        User user  = userRepo.findFirstByUserName(Name.getName());
        modal.put("user", user);
        
        UserLeaves userLeaves = userLeavesRepo.findByUserId(user.getId());
        modal.put("userLeaves", userLeaves);

        return "dashboard";
    }

    @RequestMapping("/login")
    public String login(Model model) {
        // System.out.println("Default Time Zone: " + TimeZone.getDefault().getID());
        // System.out.println("Default Time: " + LocalDateTime.now());

        User user = new User();
        model.addAttribute("user", user);
        return "auth/login";
    }

    @GetMapping("/error-404")
    public String error404(Model model, HttpSession session) {
        String user_name = session.getAttribute("user_name") != null ? session.getAttribute("user_name").toString()
                : null;
        model.addAttribute("user_name", user_name);
        return "error/error-404";
    }

    @GetMapping("/error-500")
    public String error500(Model model, HttpSession session) {
        String user_name = session.getAttribute("user_name") != null ? session.getAttribute("user_name").toString()
                : null;
        model.addAttribute("user_name", user_name);
        return "error/error-500";
    }

}
