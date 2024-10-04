package com.lhl.jobbridge.controller;

import com.lhl.jobbridge.dto.request.ApiResponse;
import com.lhl.jobbridge.dto.request.JobRecommendationRequest;
import com.lhl.jobbridge.dto.response.JobRecommendationResponse;
import com.lhl.jobbridge.service.JobRecommendationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/jobRecommendations")
public class JobRecommendationController {
    JobRecommendationService jobRecommendationService;

    @PostMapping
    ApiResponse<JobRecommendationResponse> create(@ModelAttribute JobRecommendationRequest request) {
        return ApiResponse.<JobRecommendationResponse>builder()
                .result(this.jobRecommendationService.createJobRecommendation(request))
                .build();
    }
}
