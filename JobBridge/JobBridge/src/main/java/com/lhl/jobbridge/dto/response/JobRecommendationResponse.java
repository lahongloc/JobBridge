package com.lhl.jobbridge.dto.response;

import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobRecommendationResponse {
    String id;
    Double matchingPossibility;
    CurriculumVitaeResponse curriculumVitaeResponse;
    JobPostResponse jobPostResponse;
}
