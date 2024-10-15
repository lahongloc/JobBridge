package com.lhl.jobbridge.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String fullname;
    String password;
    Boolean gender;
    String avatar;
    String companyName;
    @Column(unique = true)
    String email;
    LocalDate dob;
    @OneToMany(fetch = FetchType.EAGER)
    Set<Role> roles;
    @OneToMany(fetch = FetchType.EAGER)
    Set<CurriculumVitae> curriculumVitaes;
}
