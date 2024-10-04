package com.lhl.jobbridge.dto.request;

import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobRecommendationRequest {
    Double matchingPossibility;
    String curriculumVitaeId;
    String jobPostId;
}
