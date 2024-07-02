package com.nrzm.demo.repository;

import com.nrzm.demo.entity.Member;
import com.nrzm.demo.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findAllByMember(Member member, Pageable pageable);
}