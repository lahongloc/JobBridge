package com.lhl.jobbridge.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    INVALID_KEY(1001, "Invalid Message Key!", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception!", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1002, "User existed!", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password must be at least {min} characters!", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1003, "Unauthorized!", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1003, "Access denied", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}!", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1006, "Role not existed!", HttpStatus.NOT_FOUND),
    WORKTYPE_NOT_FOUND(1006, "Work type not existed!", HttpStatus.NOT_FOUND),
    JOBFIELD_NOT_FOUND(1006, "Job field not existed!", HttpStatus.NOT_FOUND),
    JOBLOCATION_NOT_FOUND(1006, "Job location not existed!", HttpStatus.NOT_FOUND),
    FILE_EMPTY(1003, "File is empty!", HttpStatus.BAD_REQUEST),
    FILE_FORMAT_ERROR(1003, "File is not in the right format", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_ERROR(1003, "Something went wrong, uploading failed", HttpStatus.BAD_REQUEST);


    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
