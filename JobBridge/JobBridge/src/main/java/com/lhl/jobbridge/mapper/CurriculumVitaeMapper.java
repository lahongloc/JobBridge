package com.lhl.jobbridge.mapper;

import com.lhl.jobbridge.dto.response.CurriculumVitaeResponse;
import com.lhl.jobbridge.dto.response.JobFieldResponse;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobField;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CurriculumVitaeMapper {
    @Mapping(source = "jobField", target = "jobFieldResponse")
    CurriculumVitaeResponse toCurriculumVitaeResponse(CurriculumVitae curriculumVitae);

    @Mapping(target = "jobField", ignore = true)
    CurriculumVitae toCurriculumVitae(CurriculumVitaeResponse response);
}
