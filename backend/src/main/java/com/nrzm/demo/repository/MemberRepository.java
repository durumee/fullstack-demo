package com.nrzm.demo.repository;

import com.nrzm.demo.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    Page<Member> findByIsDeletedFalse(Pageable pageable);

    Page<Member> findByIsDeletedTrue(Pageable pageable);
}