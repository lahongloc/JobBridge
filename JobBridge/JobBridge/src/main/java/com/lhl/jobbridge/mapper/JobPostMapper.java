package com.lhl.jobbridge.mapper;

import com.lhl.jobbridge.dto.request.JobPostRequest;
import com.lhl.jobbridge.dto.response.JobPostResponse;
import com.lhl.jobbridge.entity.JobPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobPostMapper {
    @Mapping(target = "workType", ignore = true)
    @Mapping(target = "jobLocation", ignore = true)
    @Mapping(target = "jobField", ignore = true)
    @Mapping(target = "user", ignore = true)
    JobPost toJobPost(JobPostRequest request);

    @Mapping(source = "user", target = "user")
    JobPostResponse toJobPostResponse(JobPost jobPost);
}