package com.lhl.jobbridge.controller;


import com.lhl.jobbridge.dto.request.ApiResponse;
import com.lhl.jobbridge.dto.request.ApplicationRequest;
import com.lhl.jobbridge.dto.response.ApplicationResponse;
import com.lhl.jobbridge.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationController {
    ApplicationService applicationService;

    @PostMapping
    ApiResponse<ApplicationResponse> createApplication(@ModelAttribute ApplicationRequest request) throws IOException {
        return ApiResponse.<ApplicationResponse>builder()
                .result(this.applicationService.createApplication(request))
                .build();
    }

    @GetMapping("/get-all-by-user")
    ApiResponse<List<ApplicationResponse>> getAllByUser() {
        return ApiResponse.<List<ApplicationResponse>>builder()
                .result(this.applicationService.getApplicationsByUser())
                .build();
    }

    @GetMapping("/jobPostId={jobPostId}")
    ApiResponse<List<ApplicationResponse>> getApplicationsByJobPost(@PathVariable("jobPostId") String jobPostId) {
        return ApiResponse.<List<ApplicationResponse>>builder()
                .result(this.applicationService.getApplicationsByJobPost(jobPostId))
                .build();
    }

    @GetMapping("/applicationId={applicationId}&isRecruiterView={isRecruiterView}")
    ApiResponse<ApplicationResponse> getApplicationById(@PathVariable("applicationId") String applicationId,
                                                        @PathVariable("isRecruiterView") boolean isRecruiterView) {
        return ApiResponse.<ApplicationResponse>builder()
                .result(this.applicationService.getApplicationById(applicationId, isRecruiterView))
                .build();
    }

}
