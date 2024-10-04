package com.lhl.jobbridge.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"curriculum_vitae_id", "job_post_id"})
)
public class JobRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    Double matchingPossibility;
    @ManyToOne
    @JoinColumn(name = "curriculum_vitae_id", nullable = false)
    CurriculumVitae curriculumVitae;

    @ManyToOne
    @JoinColumn(name = "job_post_id", nullable = false)
    JobPost jobPost;
}
