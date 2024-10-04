package com.lhl.jobbridge.mapper;

import com.lhl.jobbridge.dto.request.JobRecommendationRequest;
import com.lhl.jobbridge.dto.response.JobRecommendationResponse;
import com.lhl.jobbridge.entity.JobRecommendation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobRecommendationMapper {
    JobRecommendation toJobRecommendation(JobRecommendationRequest request);

    @Mapping(source = "curriculumVitae", target = "curriculumVitaeResponse")
    @Mapping(source = "jobPost", target = "jobPostResponse")
    JobRecommendationResponse toJobRecommendationResponse(JobRecommendation jobRecommendation);
}
