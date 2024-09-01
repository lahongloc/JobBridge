package com.lhl.jobbridge.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lhl.jobbridge.dto.request.UserCreationRequest;
import com.lhl.jobbridge.dto.request.UserUpdateRequest;
import com.lhl.jobbridge.dto.response.UserResponse;
import com.lhl.jobbridge.entity.Role;
import com.lhl.jobbridge.entity.User;
import com.lhl.jobbridge.exception.AppException;
import com.lhl.jobbridge.exception.ErrorCode;
import com.lhl.jobbridge.mapper.UserMapper;
import com.lhl.jobbridge.repository.RoleRepository;
import com.lhl.jobbridge.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    Cloudinary cloudinary;

    public User createUser(UserCreationRequest request, boolean isRecuiter) throws IOException {
        if (this.userRepository.existsUserByEmail(request.getEmail())) {
            throw new RuntimeException("ErrorCode.USER_EXISTED");
        }

        User user = this.userMapper.toUser(request);
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            Map res = this.cloudinary.uploader()
                    .upload(request.getAvatar().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            user.setAvatar(res.get("secure_url").toString());
        }

        user.setPassword(this.passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role role;
        if (isRecuiter) {
            role = this.roleRepository.findById("RECRUITER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        } else {
            role = this.roleRepository.findById("APPLICANT").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        }
        roles.add(role);
        user.setRoles(roles);


        return userRepository.save(user);
    }

    //    @PreAuthorize("hasRole('ADMIN')") // if use hasRole(), spring security will match with ones having perfix "ROLE_"

    // with hasAuthority(), spring security will match any ones in scope not having prefix "ROLE_"
    @PreAuthorize("hasAuthority('APPROVE_POST')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.email == authentication.name || hasRole('ADMIN')")
    public UserResponse getUserById(String id) {
        return this.userMapper.toUserResponse(this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!")));
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        boolean isPasswordNull = false;
        if (!(request.getPassword() != null && !request.getPassword().isEmpty())) {
            request.setPassword(user.getPassword());
            isPasswordNull = true;
        }
        userMapper.updateUser(user, request);

        if (request.getPassword() != null && !request.getPassword().isEmpty() && !isPasswordNull) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            var roles = roleRepository.findAllById(request.getRoles());
            user.setRoles(new HashSet<>(roles));
        }

        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            Map res = this.cloudinary.uploader()
                    .upload(request.getAvatar().getBytes(),
                            ObjectUtils.asMap("resource_type", "auto"));
            user.setAvatar(res.get("secure_url").toString());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = this.userRepository.findByEmail(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return this.userMapper.toUserResponse(user);
    }

    public void deleteUser(String userId) {
        this.userRepository.deleteById(userId);
    }
}
