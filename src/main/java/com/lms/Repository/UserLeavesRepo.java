package com.lms.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.Entities.UserLeaves;

@Repository
public interface UserLeavesRepo extends JpaRepository<UserLeaves, Integer> {
    
    @Query(value = "select * from user_leaves where user_id = :user_id limit 1", nativeQuery = true)
    UserLeaves findByUserId(Integer user_id);

}
