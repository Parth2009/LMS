package com.lms.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.lms.Entities.Role;
import com.lms.Repository.RoleRepo;
import com.lms.Services.User_Details;

@Controller
public class RoleController {

    @Autowired
    private RoleRepo role_repo;

    @GetMapping("/roles")
    public String rolesList(ModelMap model) {
        Sort sort = Sort.by(Sort.Order.asc("id"));
        List<Role> roles = role_repo.findAll(sort);
        model.put("roles", roles);
        return "roles/list";
    }

    // -----------------------create role

    @GetMapping("/roles/create")
    public String createRoleForm(ModelMap model) {
        Role role = new Role();
        model.put("roleObj", role);
        return "roles/create";
    }

    @PostMapping("/roles/create")
    @ResponseBody
    public ResponseEntity<Map<String, String>> createRole(@Valid @ModelAttribute("roleObj") Role role,
            BindingResult result) {
        
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map<String, String> response = new HashMap<>();

        if (result.hasErrors()) {

            Map<String, String> fieldErrors = new HashMap<>();

            for (FieldError fieldError : result.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(fieldErrors);
        } else {
            try {
                Integer user_id = ((User_Details) userDetails).getUserId();
                role.setCreated_by(user_id);
                role.setUpdated_by(user_id);
                role.setStatus("1"); // Set the status Active ("1") as Default for creating new role
                role_repo.save(role);
                response.put("status", "1");
                response.put("msg", "Role created successfully !");
            } catch (Exception e) {
                System.err.println(e.getMessage());
                response.put("status", "2");                
                response.put("msg", "Something went wrong !");
                response.put("err", e.getMessage());
            }
            return ResponseEntity.ok(response);
        }
    }

    // -----------------------create role end

}
