package com.lhl.jobbridge.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleStatisticResponse {
    long applicantNumber;
    long recruiterNumber;
}
