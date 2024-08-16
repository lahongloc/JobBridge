package com.lhl.jobbridge.service;

import com.lhl.jobbridge.dto.request.PermissionRequest;
import com.lhl.jobbridge.dto.response.PermissionResponse;
import com.lhl.jobbridge.entity.Permission;
import com.lhl.jobbridge.mapper.PermissionMapper;
import com.lhl.jobbridge.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        Permission permission = this.permissionMapper.toPermission(request);
        this.permissionRepository.save(permission);
        return this.permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void deletePermission(String name) {
        this.permissionRepository.deleteById(name);
    }
}