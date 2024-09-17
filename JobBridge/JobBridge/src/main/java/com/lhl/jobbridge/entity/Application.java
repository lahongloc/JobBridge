package com.lhl.jobbridge.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(columnDefinition = "TEXT")
    String coverLetter;
    Date createdDate;
    String hotline;
    String email;
    String status;
    @ManyToOne
    CurriculumVitae curriculumVitae;
    @ManyToOne
    JobPost jobPost;

}
