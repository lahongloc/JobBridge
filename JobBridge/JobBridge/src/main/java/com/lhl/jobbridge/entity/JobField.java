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
public class JobField {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String englishName;
    @ManyToOne
    JobFieldGroup jobFieldGroup;
}
