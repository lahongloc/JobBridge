package com.lhl.jobbridge.service;

import com.lhl.jobbridge.dto.request.JobRecommendationRequest;
import com.lhl.jobbridge.dto.response.JobRecommendationResponse;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import com.lhl.jobbridge.entity.JobRecommendation;
import com.lhl.jobbridge.entity.User;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.mapper.JobRecommendationMapper;
import com.lhl.jobbridge.repository.CurriculumVitaeRepository;
import com.lhl.jobbridge.repository.JobPostRepository;
import com.lhl.jobbridge.repository.JobRecommendationRepository;
import com.lhl.jobbridge.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobRecommendationService {
    JobRecommendationRepository jobRecommendationRepository;
    JobRecommendationMapper jobRecommendationMapper;
    CurriculumVitaeRepository curriculumVitaeRepository;
    JobPostRepository jobPostRepository;
    UserRepository userRepository;

    @NonFinal
    @Value("${jobPost.applicant-view-page-size}")
    protected String PAGE_SIZE;


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

    @PreAuthorize("hasRole('APPLICANT')")
    public Page<JobRecommendationResponse> getJobRecommendationsByApplicant(int pageNumber) {
        User user = this.userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        Pageable pageable = PageRequest.of(pageNumber - 1, Integer.parseInt(PAGE_SIZE));

        return this.jobRecommendationRepository.findAllByCurriculumVitaeIn(user.getCurriculumVitaes().stream().toList(), pageable)
                .map(this.jobRecommendationMapper::toJobRecommendationResponse);
    }
}
