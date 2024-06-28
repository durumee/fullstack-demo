package com.nrzm.demo.repository;

import com.nrzm.demo.entity.ShoppingLog;
import com.nrzm.demo.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingLogRepository extends JpaRepository<ShoppingLog, Long> {
    Page<ShoppingLog> findByMember(Member member, Pageable pageable);
}