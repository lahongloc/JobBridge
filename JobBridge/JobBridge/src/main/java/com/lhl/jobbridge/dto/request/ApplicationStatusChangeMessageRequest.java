package com.lhl.jobbridge.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationStatusChangeMessageRequest {
    String applicantName;
    String jobTitle;
    String companyName;
    String to;
    String status;
    String recruiterMailSubject;
    String recruiterMailContent;
}
