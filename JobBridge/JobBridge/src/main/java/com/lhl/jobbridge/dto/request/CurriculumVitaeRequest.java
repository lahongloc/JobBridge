package com.lhl.jobbridge.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CurriculumVitaeRequest {
    String name;
    MultipartFile CVFile;
    String jobField;
}
