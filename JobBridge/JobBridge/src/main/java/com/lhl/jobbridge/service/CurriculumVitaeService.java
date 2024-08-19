package com.lhl.jobbridge.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lhl.jobbridge.dto.request.CurriculumVitaeRequest;
import com.lhl.jobbridge.dto.response.CurriculumVitaeResponse;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.User;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.mapper.CurriculumVitaeMapper;
import com.lhl.jobbridge.repository.CurriculumVitaeRepository;
import com.lhl.jobbridge.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CurriculumVitaeService {
    CurriculumVitaeRepository curriculumVitaeRepository;
    UserRepository userRepository;
    CurriculumVitaeMapper curriculumVitaeMapper;
    Cloudinary cloudinary;

    public CurriculumVitaeResponse uploadCV(CurriculumVitaeRequest request) throws IOException {
        if (request.getCVFile() == null || request.getCVFile().isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        String fileType = request.getCVFile().getContentType();
        if (!"application/pdf".equals(fileType)) {
            throw new AppException(ErrorCode.FILE_FORMAT_ERROR);
        }

        try {
            Map res = cloudinary.uploader().upload(
                    request.getCVFile().getBytes(),
                    ObjectUtils.asMap("resource_type", "auto")
            );

            String secureUrl = (String) res.get("secure_url");
            CurriculumVitae curriculumVitae = CurriculumVitae.builder()
                    .name(request.getName())
                    .filePath(secureUrl)
                    .build();
            curriculumVitaeRepository.save(curriculumVitae);

            var context = SecurityContextHolder.getContext();
            String name = context.getAuthentication().getName();
            User user = this.userRepository.findByEmail(name)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            Set<CurriculumVitae> userCVs = user.getCurriculumVitaes();
            if (userCVs == null) {
                userCVs = new HashSet<>();
            }
            userCVs.add(curriculumVitae);
            user.setCurriculumVitaes(userCVs);
            this.userRepository.save(user);

            return curriculumVitaeMapper.toCurriculumVitaeResponse(curriculumVitae);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_ERROR);
        }
    }


}
