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
    String coverLetter;
    Date createdDate;
    @ManyToOne
    CurriculumVitae curriculumVitae;
    @ManyToOne
    JobPost jobPost;

}