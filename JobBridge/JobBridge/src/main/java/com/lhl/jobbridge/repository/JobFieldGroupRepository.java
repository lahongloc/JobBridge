package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.JobFieldGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobFieldGroupRepository extends JpaRepository<JobFieldGroup, String> {
}
