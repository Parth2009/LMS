package com.lms.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lms.Entities.User;
import com.lms.Entities.UserLeaves;
import com.lms.Repository.UserLeavesRepo;
import com.lms.Repository.UserRepository;

@Service
public class LeaveManagementService {

    @Autowired
    private UserLeavesRepo userLeavesRepo;

    @Autowired
    private UserRepository userRepository;

    // Scheduled task to reset and add leaves on January 1st and every month
    @Scheduled(cron = "0 0 0 1 1 ?", zone = "Asia/Kolkata") // Run at midnight on January 1st in IST
    public void addLeavesOnJanuary1st() {
        System.out.println("Run at midnight on January 1st in IST,  add 10 EL");
        resetLeaves();
        addLeaves(10, 0);
    }

    // Scheduled task to add leaves on July 1st
    @Scheduled(cron = "0 0 0 1 7 ?", zone = "Asia/Kolkata") // Run at midnight on July 1st in IST
    public void addLeavesOnJuly1st() {
        System.out.println("Run at midnight on July 1st in IST,  add 10 EL");
        addLeaves(10, 0);
    }

    // Scheduled task to add 1 CL every month
    @Scheduled(cron = "0 0 0 1 * ?", zone = "Asia/Kolkata") // Run at midnight on the first day of every month in IST
    public void addOneCLEveryMonth() {
        System.out.println("Run at midnight on every month,  add 1 CL");
        addLeaves(0, 1);
    }

    private void resetLeaves() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            UserLeaves userLeaves = userLeavesRepo.findByUserId(user.getId());
            if (userLeaves == null) {
                userLeaves = new UserLeaves();
                userLeaves.setUser_id(user.getId());
            }
            userLeaves.setEl(0);
            userLeaves.setCl(0);
            userLeaves.setCof(0);
            userLeavesRepo.save(userLeaves);
        }
    }

    private void addLeaves(int elToAdd, int clToAdd) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            UserLeaves userLeaves = userLeavesRepo.findByUserId(user.getId());
            if (userLeaves == null) {
                userLeaves = new UserLeaves();
                userLeaves.setUser_id(user.getId());
            }
            userLeaves.setEl(userLeaves.getEl() + elToAdd);
            userLeaves.setCl(userLeaves.getCl() + clToAdd);
            userLeavesRepo.save(userLeaves);
        }
    }

}
