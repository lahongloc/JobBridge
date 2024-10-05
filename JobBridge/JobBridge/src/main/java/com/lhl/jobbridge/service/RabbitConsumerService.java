package com.lhl.jobbridge.service;

import com.lhl.jobbridge.constants.JobQueue;
import com.lhl.jobbridge.dto.request.ApplicationStatusChangeMessageRequest;
import com.lhl.jobbridge.dto.request.JobApplicationMessageRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RabbitConsumerService {
    JavaMailSender mailSender;
    SpringTemplateEngine thymeleafTemplateEngine;

    @RabbitHandler
    @RabbitListener(queues = JobQueue.APPLICATION_STATUS_QUEUE)
    public void receiveMessage(ApplicationStatusChangeMessageRequest request) throws MessagingException {
        applicationStatusNotification(request);
    }

    @RabbitHandler
    @RabbitListener(queues = JobQueue.JOB_APPLICATION_QUEUE)
    public void receiveMessage(JobApplicationMessageRequest request) throws MessagingException {
        jobApplicationNotification(request);
    }

    private void applicationStatusNotification(ApplicationStatusChangeMessageRequest request) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(request.getTo());
        helper.setSubject("Announcement of Company recruitment results " + request.getCompanyName());

        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("applicantName", request.getApplicantName());
        thymeleafContext.setVariable("jobTitle", request.getJobTitle());
        thymeleafContext.setVariable("companyName", request.getCompanyName());
        thymeleafContext.setVariable("status", request.getStatus());
        thymeleafContext.setVariable("recruiterMailSubject", request.getRecruiterMailSubject());
        thymeleafContext.setVariable("recruiterMailContent", request.getRecruiterMailContent());

        String htmlContent = thymeleafTemplateEngine.process("application-status-email", thymeleafContext);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    private void jobApplicationNotification(JobApplicationMessageRequest request) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(request.getRecruiterEmail());
        helper.setSubject("New Application for the position: " + request.getJobTitle());

        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("applicantName", request.getApplicantName());
        thymeleafContext.setVariable("applicantEmail", request.getApplicantEmail());
        thymeleafContext.setVariable("applicantHotline", request.getApplicantHotline());
        thymeleafContext.setVariable("applicantResumeLink", request.getApplicantResumeLink());
        thymeleafContext.setVariable("companyName", request.getCompanyName());
        thymeleafContext.setVariable("appliedDate", request.getAppliedDate());
        thymeleafContext.setVariable("jobTitle", request.getJobTitle());
        thymeleafContext.setVariable("jobLocation", request.getJobLocation());
        thymeleafContext.setVariable("jobType", request.getJobType());

        String htmlContent = thymeleafTemplateEngine.process("job-application-email", thymeleafContext);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }


}
