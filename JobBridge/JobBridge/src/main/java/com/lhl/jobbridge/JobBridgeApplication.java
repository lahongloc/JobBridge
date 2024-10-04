package com.lhl.jobbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JobBridgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobBridgeApplication.class, args);
    }

}
