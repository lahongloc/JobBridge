package com.lhl.jobbridge.service;

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
}
