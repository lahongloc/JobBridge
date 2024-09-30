package com.lhl.jobbridge.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobApplicationMessageRequest {
    String applicantName;
    String jobTitle;
    String companyName;
    String to;
    String status;
    String recruiterMailSubject;
    String recruiterMailContent;
}
