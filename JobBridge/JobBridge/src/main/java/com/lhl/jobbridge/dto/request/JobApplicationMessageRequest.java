package com.lhl.jobbridge.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobApplicationMessageRequest {
    String applicantName;
    String applicantEmail;
    String applicantHotline;
    String applicantResumeLink;
    String companyName;
    String appliedDate;
    String jobTitle;
    String jobLocation;
    String jobType;
    String recruiterEmail;
}
