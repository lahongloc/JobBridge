package com.lhl.jobbridge.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lhl.jobbridge.constants.JobQueue;
import com.lhl.jobbridge.dto.request.ApplicationRequest;
import com.lhl.jobbridge.dto.request.CurriculumVitaeRequest;
import com.lhl.jobbridge.dto.request.JobApplicationMessageRequest;
import com.lhl.jobbridge.dto.request.MailSenderRequest;
import com.lhl.jobbridge.dto.response.ApplicationResponse;
import com.lhl.jobbridge.dto.response.CurriculumVitaeResponse;
import com.lhl.jobbridge.entity.Application;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
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
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
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
    MyEmailService myEmailService;
    RabbitTemplate rabbitTemplate;

    @NonFinal
    @Value("${application.unseen-status}")
    protected String UNSEEN_STATUS;

    @NonFinal
    @Value("${application.seen-status}")
    protected String SEEN_STATUS;

    @NonFinal
    @Value("${application.suitable-status}")
    protected String SUITABLE_STATUS;

    @NonFinal
    @Value("${application.not-suitable-status}")
    protected String NOT_SUITABLE_STATUS;

    @PreAuthorize("hasRole('RECRUITER')")
    public void updateApplicationStatus(String applicationId, boolean isSuitable, MailSenderRequest request) {
        Application application = this.applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_FOUND));

        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!application.getJobPost().getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.NO_PERMISSION_ACCESS_APPLICATION);
        }

        if (isSuitable) {
            application.setStatus(SUITABLE_STATUS);
        } else application.setStatus(NOT_SUITABLE_STATUS);
        this.applicationRepository.save(application);

        Optional<User> applicant = this.userRepository.findByCurriculumVitaes_Id(application.getCurriculumVitae().getId());

        JobApplicationMessageRequest messageRequest = JobApplicationMessageRequest.builder()
                .applicantName(applicant.get().getFullname())
                .companyName(application.getJobPost().getUser().getCompanyName())
                .jobTitle(application.getJobPost().getJobTitle())
                .status(isSuitable ? "Hồ sơ phù hợp" : "Hồ sơ chưa phù hợp")
                .recruiterMailSubject(request.getSubject())
                .recruiterMailContent(request.getText())
                .to(request.getTo())
                .build();
        this.rabbitTemplate.convertAndSend(JobQueue.JOB_APPLICATION_QUEUE, messageRequest);

//        this.myEmailService.sendEmail(request.getTo(), request.getSubject(), request.getText());
    }

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
        application.setStatus(UNSEEN_STATUS);
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

    @PreAuthorize("hasRole('RECRUITER')")
    public List<ApplicationResponse> getApplicationsByJobPost(String jobPostId) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        JobPost jobPost = this.jobPostRepository.findById(jobPostId).orElseThrow(() -> new AppException(ErrorCode.JOBPOST_NOT_FOUND));
        if (!jobPost.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.JOBPOST_NOT_OWNED_BY_USER);
        }

        return this.applicationRepository.findApplicationsByJobPost_Id(jobPost.getId())
                .stream().map(applicationMapper::toApplicationResponse).toList();
    }

    public ApplicationResponse getApplicationById(String applicationId, boolean isRecruiterView) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = this.userRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Application application = this.applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_FOUND));
        if (!(user.getCurriculumVitaes().contains(application.getCurriculumVitae()) || application.getJobPost().getUser().getId().equals(user.getId()))) {
            throw new AppException(ErrorCode.NO_PERMISSION_ACCESS_APPLICATION);
        }

        if (isRecruiterView && application.getStatus().equals(UNSEEN_STATUS)) {
            application.setStatus(SEEN_STATUS);
            this.applicationRepository.save(application);
        }

        return this.applicationMapper.toApplicationResponse(application);
    }

}
