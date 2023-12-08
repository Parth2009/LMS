package com.lms.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.Entities.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Integer> {
    
}
