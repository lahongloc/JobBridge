package com.lhl.jobbridge.controller;


import com.lhl.jobbridge.dto.request.ApiResponse;
import com.lhl.jobbridge.dto.request.ApplicationRequest;
import com.lhl.jobbridge.dto.response.ApplicationResponse;
import com.lhl.jobbridge.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
