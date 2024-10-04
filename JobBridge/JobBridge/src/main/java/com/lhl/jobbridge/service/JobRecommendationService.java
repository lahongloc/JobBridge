package com.lhl.jobbridge.service;

import com.lhl.jobbridge.dto.request.JobRecommendationRequest;
import com.lhl.jobbridge.dto.response.JobRecommendationResponse;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import com.lhl.jobbridge.entity.JobRecommendation;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.mapper.JobRecommendationMapper;
import com.lhl.jobbridge.repository.CurriculumVitaeRepository;
import com.lhl.jobbridge.repository.JobPostRepository;
import com.lhl.jobbridge.repository.JobRecommendationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobRecommendationService {
    JobRecommendationRepository jobRecommendationRepository;
    JobRecommendationMapper jobRecommendationMapper;
    CurriculumVitaeRepository curriculumVitaeRepository;
    JobPostRepository jobPostRepository;

    public JobRecommendationResponse createJobRecommendation(JobRecommendationRequest request) {
        JobRecommendation jobRecommendation = this.jobRecommendationMapper.toJobRecommendation(request);
        CurriculumVitae curriculumVitae = this.curriculumVitaeRepository.findById(request.getCurriculumVitaeId())
                .orElseThrow(() -> new AppException(ErrorCode.CURRICULUM_VITAE_NOT_FOUND));
        JobPost jobPost = this.jobPostRepository.findById(request.getJobPostId())
                .orElseThrow(() -> new AppException(ErrorCode.JOBPOST_NOT_FOUND));

        jobRecommendation.setJobPost(jobPost);
        jobRecommendation.setCurriculumVitae(curriculumVitae);

        return this.jobRecommendationMapper.toJobRecommendationResponse(this.jobRecommendationRepository.save(jobRecommendation));
    }
}
