package com.lhl.jobbridge.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationResponse {
    String id;
    String coverLetter;
    Date createdDate;
    String hotline;
    String email;
    CurriculumVitae curriculumVitae;
    JobPost jobPost;
    String status;
}
