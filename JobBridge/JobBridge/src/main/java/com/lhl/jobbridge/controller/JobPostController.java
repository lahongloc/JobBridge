package com.lhl.jobbridge.controller;


import com.lhl.jobbridge.dto.request.ApiResponse;
import com.lhl.jobbridge.dto.request.JobPostRequest;
import com.lhl.jobbridge.dto.request.JobPostSearchRequest;
import com.lhl.jobbridge.dto.response.JobPostResponse;
import com.lhl.jobbridge.service.JobPostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobPosts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobPostController {
    JobPostService jobPostService;

    @PostMapping
    ApiResponse<JobPostResponse> createJobPost(@RequestBody JobPostRequest request) {
        return ApiResponse.<JobPostResponse>builder()
                .result(this.jobPostService.createJobPost(request))
                .build();
    }


    @GetMapping("/get-by-user/page={pageNumber}")
    ApiResponse<Page<JobPostResponse>> getByUser(
            @PathVariable int pageNumber
    ) {
        return ApiResponse.<Page<JobPostResponse>>builder()
                .result(this.jobPostService.getJobPostsByRecruiter(pageNumber))
                .build();
    }

    @PostMapping("/search-jobPost")
    ApiResponse<Page<JobPostResponse>> getAll(@RequestBody JobPostSearchRequest request) {
        return ApiResponse.<Page<JobPostResponse>>builder()
                .result(this.jobPostService.getAll(request))
                .build();
    }

    @GetMapping("/jobPostId={jobPostId}")
    ApiResponse<JobPostResponse> getById(@PathVariable String jobPostId) {
        return ApiResponse.<JobPostResponse>builder()
                .result(this.jobPostService.getById(jobPostId))
                .build();
    }

    @PutMapping("/{jobPostId}")
    ApiResponse<JobPostResponse> updateJobPost(@RequestBody JobPostRequest request,
                                               @PathVariable("jobPostId") String jobPostId) {
        return ApiResponse.<JobPostResponse>builder()
                .result(this.jobPostService.updateJobPost(request, jobPostId))
                .build();
    }

    @DeleteMapping("/{jobPostId}")
    ApiResponse<Void> deleteJobpost(@PathVariable("jobPostId") String jobPostId) {
        this.jobPostService.deleteJobPost(jobPostId);
        return ApiResponse.<Void>builder().build();
    }

}
