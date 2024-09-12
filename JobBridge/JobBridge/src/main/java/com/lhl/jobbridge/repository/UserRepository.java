package com.lhl.jobbridge.repository;

import com.lhl.jobbridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsUserByEmail(String email);

    Optional<User> findByCurriculumVitaes_Id(String curriculumVitaeId);

    Optional<User> findByEmail(String email);
}
