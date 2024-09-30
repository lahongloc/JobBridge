package com.lhl.jobbridge.configuration;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import com.cloudinary.utils.ObjectUtils;
import com.lhl.jobbridge.entity.*;
import com.lhl.jobbridge.repository.RoleRepository;
import com.lhl.jobbridge.repository.UserRepository;
import com.lhl.jobbridge.service.JobFieldService;
import com.lhl.jobbridge.service.JobLocationService;
import com.lhl.jobbridge.service.WorkTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Properties;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    RoleRepository roleRepository;
    WorkTypeService workTypeService;
    JobLocationService jobLocationService;
    JobFieldService jobFieldService;

    @NonFinal
    @Value("${cloudinary.cloud-name}")
    String CLOUD_NAME;

    @NonFinal
    @Value("${cloudinary.api-key}")
    String API_KEY;

    @NonFinal
    @Value("${cloudinary.api-secret}")
    String API_SECRET;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CLOUD_NAME,
                "api_key", API_KEY,
                "api_secret", API_SECRET));
    }

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            initializeWorkType();
            initilaizeJobLocation();
            initializeJobField();
            Role adminRole = Role.builder().name("ADMIN").description("admin role").build();
            Role applicantRole = Role.builder().name("APPLICANT").description("applicant role").build();
            Role recruiterRole = Role.builder().name("RECRUITER").description("recruiter role").build();
            this.roleRepository.saveAll(List.of(adminRole, applicantRole, recruiterRole));

            var roles = new HashSet<Role>();
            roles.add(adminRole);
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User user = User.builder()
                        .email("admin@gmail.com")
                        .password(this.passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();

                this.userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it!");
            }
        };
    }

    void initializeWorkType() {
        WorkType fullTime = WorkType.builder().name("Full-time").build();
        WorkType partTime = WorkType.builder().name("Part-time").build();
        WorkType freelance = WorkType.builder().name("Freelance").build();
        WorkType remote = WorkType.builder().name("Remote").build();
        WorkType internship = WorkType.builder().name("Internship").build();
        WorkType temporary = WorkType.builder().name("Temporary").build();
        WorkType contract = WorkType.builder().name("Contract").build();

        List<WorkType> workTypes = List.of(fullTime, partTime, freelance, remote, internship, temporary, contract);

        this.workTypeService.saveAllWorkTypesIfNotExists(workTypes);
    }

    void initilaizeJobLocation() {
        List<JobLocation> jobLocations = List.of(
                JobLocation.builder().name("Hà Nội").build(),
                JobLocation.builder().name("TP Hồ Chí Minh").build(),
                JobLocation.builder().name("Đà Nẵng").build(),
                JobLocation.builder().name("Hải Phòng").build(),
                JobLocation.builder().name("Cần Thơ").build(),
                JobLocation.builder().name("Bà Rịa - Vũng Tàu").build(),
                JobLocation.builder().name("Bắc Giang").build(),
                JobLocation.builder().name("Bắc Kạn").build(),
                JobLocation.builder().name("Bạc Liêu").build(),
                JobLocation.builder().name("Bắc Ninh").build(),
                JobLocation.builder().name("Bến Tre").build(),
                JobLocation.builder().name("Bình Định").build(),
                JobLocation.builder().name("Bình Dương").build(),
                JobLocation.builder().name("Bình Phước").build(),
                JobLocation.builder().name("Bình Thuận").build(),
                JobLocation.builder().name("Cà Mau").build(),
                JobLocation.builder().name("Cao Bằng").build(),
                JobLocation.builder().name("Đắk Lắk").build(),
                JobLocation.builder().name("Đắk Nông").build(),
                JobLocation.builder().name("Điện Biên").build(),
                JobLocation.builder().name("Đồng Nai").build(),
                JobLocation.builder().name("Đồng Tháp").build(),
                JobLocation.builder().name("Gia Lai").build(),
                JobLocation.builder().name("Hà Giang").build(),
                JobLocation.builder().name("Hà Nam").build(),
                JobLocation.builder().name("Hà Tĩnh").build(),
                JobLocation.builder().name("Hải Dương").build(),
                JobLocation.builder().name("Hậu Giang").build(),
                JobLocation.builder().name("Hòa Bình").build(),
                JobLocation.builder().name("Hưng Yên").build(),
                JobLocation.builder().name("Khánh Hòa").build(),
                JobLocation.builder().name("Kiên Giang").build(),
                JobLocation.builder().name("Kon Tum").build(),
                JobLocation.builder().name("Lai Châu").build(),
                JobLocation.builder().name("Lâm Đồng").build(),
                JobLocation.builder().name("Lạng Sơn").build(),
                JobLocation.builder().name("Lào Cai").build(),
                JobLocation.builder().name("Long An").build(),
                JobLocation.builder().name("Nam Định").build(),
                JobLocation.builder().name("Nghệ An").build(),
                JobLocation.builder().name("Ninh Bình").build(),
                JobLocation.builder().name("Ninh Thuận").build(),
                JobLocation.builder().name("Phú Thọ").build(),
                JobLocation.builder().name("Phú Yên").build(),
                JobLocation.builder().name("Quảng Bình").build(),
                JobLocation.builder().name("Quảng Nam").build(),
                JobLocation.builder().name("Quảng Ngãi").build(),
                JobLocation.builder().name("Quảng Ninh").build(),
                JobLocation.builder().name("Quảng Trị").build(),
                JobLocation.builder().name("Sóc Trăng").build(),
                JobLocation.builder().name("Sơn La").build(),
                JobLocation.builder().name("Tây Ninh").build(),
                JobLocation.builder().name("Thái Bình").build(),
                JobLocation.builder().name("Thái Nguyên").build(),
                JobLocation.builder().name("Thanh Hóa").build(),
                JobLocation.builder().name("Thừa Thiên Huế").build(),
                JobLocation.builder().name("Tiền Giang").build(),
                JobLocation.builder().name("Trà Vinh").build(),
                JobLocation.builder().name("Tuyên Quang").build(),
                JobLocation.builder().name("Vĩnh Long").build(),
                JobLocation.builder().name("Vĩnh Phúc").build(),
                JobLocation.builder().name("Yên Bái").build()
        );

        this.jobLocationService.saveAllJobLocationsIfNotExists(jobLocations);
    }

    void initializeJobField() {
        List<JobField> jobFields = List.of(
                JobField.builder().name("Công nghệ thông tin").englishName("INFORMATION-TECHNOLOGY").build(),
                JobField.builder().name("Kế toán").englishName("ACCOUNTANT").build(),
                JobField.builder().name("Marketing").englishName("MARKETING").build(),
                JobField.builder().name("Nhân sự").englishName("HR").build(),
                JobField.builder().name("Bán hàng").englishName("SALES").build(),
                JobField.builder().name("Thiết kế đồ họa").englishName("DESIGNER").build(),
                JobField.builder().name("Kỹ thuật").englishName("ENGINEERING").build(),
                JobField.builder().name("Ngân hàng").englishName("BANKING").build(),
                JobField.builder().name("Y tế").englishName("HEALTHCARE").build(),
                JobField.builder().name("Giáo dục").englishName("TEACHER").build(),
                JobField.builder().name("Luật pháp").englishName("ADVOCATE").build(),
                JobField.builder().name("Dịch vụ khách hàng").englishName("PUBLIC-RELATIONS").build(),
                JobField.builder().name("Logistics").englishName("LOGISTICS").build(),
                JobField.builder().name("Nghệ thuật").englishName("ARTS").build(),
                JobField.builder().name("Kinh doanh quốc tế").englishName("BUSINESS-DEVELOPMENT").build(),
                JobField.builder().name("Xây dựng").englishName("CONSTRUCTION").build(),
                JobField.builder().name("Bất động sản").englishName("REAL ESTATE").build(),
                JobField.builder().name("Nhà hàng - Khách sạn").englishName("BPO").build(),
                JobField.builder().name("Hàng không").englishName("AVIATION").build(),
                JobField.builder().name("Tài chính").englishName("FINANCE").build(),
                JobField.builder().name("Tư vấn viên").englishName("CONSULTANT").build(),
                JobField.builder().name("Thể hình").englishName("FITNESS").build()
        );

        this.jobFieldService.saveAllJobFieldsIfNotExists(jobFields);
    }

    @NonFinal
    @Value("${spring-mail.mail.username}")
    protected String MAIL_USERNAME;

    @NonFinal
    @Value("${spring-mail.mail.password}")
    protected String MAIL_PASSWORD;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername(MAIL_USERNAME);
        mailSender.setPassword(MAIL_PASSWORD);

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.debug", "true");

        return mailSender;
    }
}
