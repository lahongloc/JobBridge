package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.CurriculumVitae;
import com.lhl.jobbridge.entity.Role;
import com.lhl.jobbridge.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsUserByEmail(String email);

    Optional<User> findByCurriculumVitaes_Id(String curriculumVitaeId);

    Optional<User> findByEmail(String email);

    Page<User> findAllByRolesContaining(Role role, Pageable pageable);

    long countByRolesContains(Role role);

}
