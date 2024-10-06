package com.lhl.jobbridge.service;

import com.lhl.jobbridge.constants.JobQueue;
import com.lhl.jobbridge.dto.request.JobRecommendRequest;
import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.JobPost;
import com.lhl.jobbridge.entity.JobRecommendation;
import com.lhl.jobbridge.repository.CurriculumVitaeRepository;
import com.lhl.jobbridge.repository.JobPostRepository;
import com.lhl.jobbridge.repository.JobRecommendationRepository;
import com.lhl.jobbridge.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApiService {
    RestTemplate restTemplate;
    CurriculumVitaeRepository curriculumVitaeRepository;
    JobPostRepository jobPostRepository;
    JobRecommendationRepository jobRecommendationRepository;
    //    RabbitTemplate rabbitTemplate;
    UserRepository userRepository;

    @NonFinal
    @Value("${server-cv.similarity-calc}")
    protected String SIMILARYTI_CALC_API;

    @NonFinal
    @Value("${server-cv.cv-classify}")
    protected String CV_CLASSIFY_API;


    public String classifyCV(String linkCV) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
        formData.add("cv_link", linkCV);
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(formData, headers);
            return this.restTemplate.postForObject(CV_CLASSIFY_API, requestEntity, String.class);
        } catch (Exception e) {
            log.error("Error calling classify cv API", e);
            return "Error calling API";
        }
    }


    @Scheduled(fixedRate = 20000)
    @Transactional
    public void implementJobRecommendation() {
//        this.jobRecommendationRepository.deleteAll();
        List<CurriculumVitae> curriculumVitaeList = this.curriculumVitaeRepository.findAll();
        List<JobPost> jobPostList = this.jobPostRepository.findByApplicationDueDateAfter(new Date());

        if (!curriculumVitaeList.isEmpty() && !jobPostList.isEmpty()) {
            curriculumVitaeList.forEach(curriculumVitae -> {
                jobPostList.forEach(jobPost -> {
                    if (!this.jobRecommendationRepository.existsByCurriculumVitae_IdAndJobPost_Id(curriculumVitae.getId(), jobPost.getId())) {
                        if (jobPost.getJobField().getJobFieldGroup().getId().equals(curriculumVitae.getJobField().getJobFieldGroup().getId())) {

                            MultiValueMap<String, String> formData = new LinkedMultiValueMap<String, String>();
                            formData.add("cv_link", curriculumVitae.getFilePath());
                            formData.add("jd_text", jobPost.getJobDescription() + jobPost.getRequirements());

                            try {
                                HttpHeaders headers = new HttpHeaders();
                                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                                HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(formData, headers);
                                String response = this.restTemplate.postForObject(SIMILARYTI_CALC_API, requestEntity, String.class);

                                assert response != null;
                                if (Double.parseDouble(response) >= 20.0) {
                                    JobRecommendation jobRecommendation = JobRecommendation.builder()
                                            .curriculumVitae(curriculumVitae)
                                            .jobPost(jobPost)
                                            .matchingPossibility(Double.parseDouble(response))
                                            .build();
                                    this.jobRecommendationRepository.save(jobRecommendation);

//                                    JobRecommendRequest request = JobRecommendRequest.builder()
//                                            .to(this.userRepository.findByCurriculumVitaes_Id(curriculumVitae.getId()).get().getEmail())
//                                            .link("http://localhost:5173/view-job-recommendations")
//                                            .build();
//
//                                    this.rabbitTemplate.convertAndSend(JobQueue.JOB_RECOMMENDATION_QUEUE, request);
                                }
                            } catch (Exception e) {
                                log.error("Error calling similarity API", e);
                            }
                        }
                    }
                });
            });
        }

    }
}
