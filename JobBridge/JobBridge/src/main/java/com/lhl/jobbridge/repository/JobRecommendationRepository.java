package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobRecommendation;
import com.lhl.jobbridge.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRecommendationRepository extends JpaRepository<JobRecommendation, String> {
    boolean existsByCurriculumVitae_IdAndJobPost_Id(String cvId, String jobPostId);

    Page<JobRecommendation> findAllByCurriculumVitaeIn(List<CurriculumVitae> curriculumVitaeList, Pageable pageable);

    @Query("SELECT DISTINCT jr.curriculumVitae FROM JobRecommendation jr")
    List<CurriculumVitae> findDistinctCurriculumVitaesWithJobRecommendations();
}
