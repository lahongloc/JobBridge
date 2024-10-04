package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.JobPost;
import com.lhl.jobbridge.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, String>, JpaSpecificationExecutor<JobPost> {
    Page<JobPost> findByUser(User user, Pageable pageable);

    Page<JobPost> findByJobTitleContainingIgnoreCaseAndJobLocation_NameContainingIgnoreCaseAndWorkType_NameContainingIgnoreCase(
            String jobTitle, String jobLocationName, String workTypeName, Pageable pageable);

    List<JobPost> findAllByJobField_JobFieldGroup_Id(String jobFieldGroupId);

    List<JobPost> findByApplicationDueDateAfter(Date currentDate);
}
