package com.lhl.jobbridge.service;

import com.lhl.jobbridge.constants.JobQueue;
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
    @RabbitListener(queues = JobQueue.JOB_APPLICATION_QUEUE)
    public void receiveMessage(JobApplicationMessageRequest request) throws MessagingException {
        log.info("message la: " + request);
        applicationNotification(request);
//        this.send(message);
//        sendEmailNotification(message);
    }

    private void applicationNotification(JobApplicationMessageRequest request) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(request.getTo());
        helper.setSubject("Thông báo kết quả tuyển dụng Công ty " + request.getCompanyName());

        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("applicantName", request.getApplicantName());
        thymeleafContext.setVariable("jobTitle", request.getJobTitle());
        thymeleafContext.setVariable("companyName", request.getCompanyName());
        thymeleafContext.setVariable("status", request.getStatus());
        thymeleafContext.setVariable("recruiterMailSubject", request.getRecruiterMailSubject());
        thymeleafContext.setVariable("recruiterMailContent", request.getRecruiterMailContent());


        String htmlContent = thymeleafTemplateEngine.process("job-application-email", thymeleafContext);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }


}
