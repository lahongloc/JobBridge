package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.JobRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRecommendationRepository extends JpaRepository<JobRecommendation, String> {
    boolean existsByCurriculumVitae_IdAndJobPost_Id(String cvId, String jobPostId);
}
