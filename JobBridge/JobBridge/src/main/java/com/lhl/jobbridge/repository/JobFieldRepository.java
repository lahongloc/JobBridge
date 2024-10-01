package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.JobField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobFieldRepository extends JpaRepository<JobField, String> {
    boolean existsByName(String name);

    JobField findByEnglishName(String name);
}
