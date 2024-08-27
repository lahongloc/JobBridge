package com.lhl.jobbridge.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lhl.jobbridge.dto.request.ApplicationRequest;
import com.lhl.jobbridge.dto.request.CurriculumVitaeRequest;
import com.lhl.jobbridge.dto.response.ApplicationResponse;
import com.lhl.jobbridge.dto.response.CurriculumVitaeResponse;
import com.lhl.jobbridge.entity.Application;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.User;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.mapper.ApplicationMapper;
import com.lhl.jobbridge.mapper.CurriculumVitaeMapper;
import com.lhl.jobbridge.repository.ApplicationRepository;
import com.lhl.jobbridge.repository.CurriculumVitaeRepository;
import com.lhl.jobbridge.repository.JobPostRepository;
import com.lhl.jobbridge.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationService {
    ApplicationRepository applicationRepository;
    ApplicationMapper applicationMapper;
    CurriculumVitaeRepository curriculumVitaeRepository;
    CurriculumVitaeService curriculumVitaeService;
    JobPostRepository jobPostRepository;
    CurriculumVitaeMapper curriculumVitaeMapper;
    UserRepository userRepository;

    public ApplicationResponse createApplication(ApplicationRequest request) throws IOException {
        var jobPost = this.jobPostRepository.findById(request.getJobPost())
                .orElseThrow(() -> new AppException(ErrorCode.JOBPOST_NOT_FOUND));
        if (new Date().after(jobPost.getApplicationDueDate())) {
            throw new AppException(ErrorCode.APPLICATION_DUE_DATE_PASSED);
        }

        CurriculumVitae curriculumVitae;
        if (request.getCurriculumVitae() != null && !request.getCurriculumVitae().isEmpty()) {
            curriculumVitae = this.curriculumVitaeRepository.findById(request.getCurriculumVitae())
                    .orElseThrow(() -> new AppException(ErrorCode.CURRICULUM_VITAE_NOT_FOUND));

            var context = SecurityContextHolder.getContext();
            String name = context.getAuthentication().getName();
            User user = this.userRepository.findByEmail(name)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            if (!user.getCurriculumVitaes().contains(curriculumVitae)) {
                throw new AppException(ErrorCode.CURRICULUM_VITAE_NOT_OWNED_BY_USER);
            }
        } else {
            String originalFilename = request.getCurriculumVitaeFile().getOriginalFilename();
            String fileName;
            if (originalFilename != null && originalFilename.contains(".")) {
                fileName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
            } else {
                fileName = originalFilename;
            }
            CurriculumVitaeRequest curriculumVitaeRequest = CurriculumVitaeRequest.builder()
                    .name(fileName)
                    .CVFile(request.getCurriculumVitaeFile())
                    .build();
            CurriculumVitaeResponse curriculumVitaeResponse = this.curriculumVitaeService.uploadCV(curriculumVitaeRequest);
            curriculumVitae = this.curriculumVitaeMapper.toCurriculumVitae(curriculumVitaeResponse);
        }

        Application application = this.applicationMapper.toApplication(request);
        application.setCreatedDate(new Date());
        application.setCurriculumVitae(curriculumVitae);
        application.setJobPost(jobPost);
        this.applicationRepository.save(application);

        return this.applicationMapper.toApplicationResponse(application);
    }

    public List<ApplicationResponse> getApplicationsByUser() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var curriculumVitaes = user.getCurriculumVitaes();
        List<Application> applications = new ArrayList<>();
        curriculumVitaes.forEach(curriculumVitae -> {
            applications.addAll(this.applicationRepository.findApplicationsByCurriculumVitae(curriculumVitae));
        });

        return applications.stream().map(this.applicationMapper::toApplicationResponse).toList();
    }
}
