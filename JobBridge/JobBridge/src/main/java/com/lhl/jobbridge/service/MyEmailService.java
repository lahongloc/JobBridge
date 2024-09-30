package com.lhl.jobbridge.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MyEmailService {
    JavaMailSender javaMailSender;

    @NonFinal
    @Value("${spring-mail.mail.username}")
    protected String FROM_SENDER;

    public void sendEmail(String to, String subject, String text) {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            messageHelper.setFrom(FROM_SENDER);
            messageHelper.setTo(to);
            messageHelper.setSubject(subject);
            String htmlContent = "<html><body><h5>" + text + "</h5></body></html>";
            messageHelper.setText(htmlContent, true);
        };

        this.javaMailSender.send(messagePreparator);
    }
}
