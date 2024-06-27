package com.nrzm.demo.repository;

import com.nrzm.demo.entity.ShoppingLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingLogRepository extends JpaRepository<ShoppingLog, Long> {
}