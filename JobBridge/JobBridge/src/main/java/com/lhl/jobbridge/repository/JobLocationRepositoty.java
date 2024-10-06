package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.JobLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobLocationRepositoty extends JpaRepository<JobLocation, String> {
    boolean existsByName(String name);

}
