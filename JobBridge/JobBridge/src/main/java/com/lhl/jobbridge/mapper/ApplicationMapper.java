package com.lhl.jobbridge.mapper;

import com.lhl.jobbridge.dto.request.ApplicationRequest;
import com.lhl.jobbridge.dto.response.ApplicationResponse;
import com.lhl.jobbridge.entity.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    @Mapping(target = "curriculumVitae", ignore = true)
    @Mapping(target = "jobPost", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    Application toApplication(ApplicationRequest request);

    @Mapping(source = "status", target = "status")
    ApplicationResponse toApplicationResponse(Application application);
}
