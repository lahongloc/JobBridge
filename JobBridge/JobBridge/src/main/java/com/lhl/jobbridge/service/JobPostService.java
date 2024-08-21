package com.lhl.jobbridge.service;

import com.lhl.jobbridge.dto.request.JobPostRequest;
import com.lhl.jobbridge.dto.request.JobPostSearchRequest;
import com.lhl.jobbridge.dto.response.JobPostResponse;
import com.lhl.jobbridge.entity.*;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.helper.JobPostSpecifications;
import com.lhl.jobbridge.mapper.JobPostMapper;
import com.lhl.jobbridge.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobPostService {
    JobPostRepository jobPostRepository;
    WorkTypeRepository workTypeRepository;
    JobLocationRepositoty jobLocationRepositoty;
    JobFieldRepository jobFieldRepository;
    JobPostMapper jobPostMapper;
    UserRepository userRepository;

    @NonFinal
    @Value("${jobPost.cruiter-view-page-size}")
    protected String RECRUITER_VIEW_PAGE_SIZE;

    @NonFinal
    @Value("${jobPost.applicant-view-page-size}")
    protected String APPLICANT_VIEW_PAGE_SIZE;

    @NonFinal
    @Value("${jobPost.recommended-page-size}")
    protected String RECOMMENDED_PAGE_SIZE;


    public JobPostResponse getById(String id) {
        return this.jobPostMapper.toJobPostResponse(this.jobPostRepository
                .findById(id).orElseThrow(() -> new AppException(ErrorCode.JOBPOST_NOT_FOUND)));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    public JobPostResponse createJobPost(JobPostRequest request) {
        var workType = this.workTypeRepository.
                findById(request.getWorkType())
                .orElseThrow(() -> new AppException(ErrorCode.WORKTYPE_NOT_FOUND));

        var jobLocation = this.jobLocationRepositoty
                .findById(request.getJobLocation())
                .orElseThrow(() -> new AppException(ErrorCode.JOBLOCATION_NOT_FOUND));

        var jobField = this.jobFieldRepository
                .findById(request.getJobField())
                .orElseThrow(() -> new AppException(ErrorCode.JOBFIELD_NOT_FOUND));

        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        JobPost jobPost = this.jobPostMapper.toJobPost(request);
        jobPost.setWorkType(workType);
        jobPost.setJobLocation(jobLocation);
        jobPost.setJobField(jobField);
        jobPost.setUser(user);
        jobPost.setCreatedDate(new Date());
        this.jobPostRepository.save(jobPost);

        return this.jobPostMapper.toJobPostResponse(jobPost);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    public Page<JobPostResponse> getJobPostsByRecruiter(int pageNumber) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Điều chỉnh pageNumber để bắt đầu từ 0
        Pageable pageable = PageRequest.of(pageNumber - 1, Integer.parseInt(RECRUITER_VIEW_PAGE_SIZE));
        return this.jobPostRepository.findByUser(user, pageable)
                .map(this.jobPostMapper::toJobPostResponse);
    }

    public Page<JobPostResponse> getAll(JobPostSearchRequest request) {
        String jobTitle = request.getJobTitle();
        String jobLocationId = request.getJobLocation();
        String workTypeId = request.getWorkType();
        String jobFieldId = request.getJobField();

        Pageable pageable = PageRequest.of(request.getPageNumber() - 1, Integer.parseInt(APPLICANT_VIEW_PAGE_SIZE));

        Specification<JobPost> spec = Specification.where(null);

        if (jobTitle != null && !jobTitle.isEmpty()) {
            spec = spec.and(JobPostSpecifications.jobTitleContains(jobTitle));
        }

        if (jobLocationId != null && !jobLocationId.isEmpty()) {
            JobLocation jobLocation = this.jobLocationRepositoty
                    .findById(jobLocationId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOBLOCATION_NOT_FOUND));
            spec = spec.and(JobPostSpecifications.jobLocationEquals(jobLocation.getName()));
        }

        if (workTypeId != null && !workTypeId.isEmpty()) {
            WorkType workType = this.workTypeRepository
                    .findById(workTypeId)
                    .orElseThrow(() -> new AppException(ErrorCode.WORKTYPE_NOT_FOUND));
            spec = spec.and(JobPostSpecifications.workTypeEquals(workType.getName()));
        }

        if (jobFieldId != null && !jobFieldId.isEmpty()) {
            JobField jobField = this.jobFieldRepository
                    .findById(jobFieldId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOBFIELD_NOT_FOUND));
            spec = spec.and(JobPostSpecifications.jobFieldEquals(jobField.getName()));
        }


        return this.jobPostRepository.findAll(spec, pageable)
                .map(this.jobPostMapper::toJobPostResponse);
    }
}
