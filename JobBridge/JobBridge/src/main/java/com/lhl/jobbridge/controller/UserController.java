package com.lhl.jobbridge.controller;

import com.lhl.jobbridge.dto.request.ApiResponse;
import com.lhl.jobbridge.dto.request.UserCreationRequest;
import com.lhl.jobbridge.dto.request.UserUpdateRequest;
import com.lhl.jobbridge.dto.response.RoleStatisticResponse;
import com.lhl.jobbridge.dto.response.UserResponse;
import com.lhl.jobbridge.entity.User;
import com.lhl.jobbridge.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/create-applicant")
    ApiResponse<User> createApplicant(@ModelAttribute @Valid UserCreationRequest request) throws IOException {
        ApiResponse<User> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.createUser(request, false));
        return apiResponse;
    }

    @PostMapping("/create-recruiter")
    ApiResponse<User> createRecruiter(@ModelAttribute @Valid UserCreationRequest request) throws IOException {
        ApiResponse<User> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.createUser(request, true));
        return apiResponse;
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(this.userService.getUsers())
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(this.userService.getMyInfo())
                .build();
    }

    @GetMapping("/{userId}")
    UserResponse getUser(@PathVariable("userId") String userId) {
        return this.userService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    UserResponse updateUser(@PathVariable("userId") String userId, @ModelAttribute UserUpdateRequest request) throws IOException {
        log.info("request: " + request);
        return this.userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    void deleteUser(@PathVariable("userId") String userId) {
        this.userService.deleteUser(userId);
    }

    @GetMapping("/get-users/role={role}&pageNumber={pageNumber}")
    ApiResponse<Page<UserResponse>> getUsersByRole(@PathVariable("role") String role,
                                                   @PathVariable("pageNumber") int pageNumber) {
        return ApiResponse.<Page<UserResponse>>builder().result(this.userService.getUsersByRole(role, pageNumber)).build();
    }

    @GetMapping("/role-statistic")
    ApiResponse<RoleStatisticResponse> roleStatistic() {
        return ApiResponse.<RoleStatisticResponse>builder().result(this.userService.roleStatistic()).build();
    }

}
