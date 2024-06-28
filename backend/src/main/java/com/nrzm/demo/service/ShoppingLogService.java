package com.nrzm.demo.service;

import com.nrzm.demo.entity.ShoppingLog;
import com.nrzm.demo.entity.Member;
import com.nrzm.demo.repository.ShoppingLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ShoppingLogService {

    @Autowired
    private ShoppingLogRepository shoppingLogRepository;

    @Transactional
    public ShoppingLog saveShoppingLog(ShoppingLog shoppingLog) {
        if (shoppingLog.getId() == null) {
            shoppingLog.setCreatedAt(LocalDateTime.now());
        }
        shoppingLog.setUpdatedAt(LocalDateTime.now());
        return shoppingLogRepository.save(shoppingLog);
    }

    @Transactional(readOnly = true)
    public ShoppingLog getShoppingLogById(Long id) {
        return shoppingLogRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public Page<ShoppingLog> getShoppingLogsByMember(Member member, Pageable pageable) {
        return shoppingLogRepository.findByMember(member, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ShoppingLog> getAllShoppingLogs(Pageable pageable) {
        return shoppingLogRepository.findAll(pageable);
    }

    @Transactional
    public void deleteShoppingLog(Long id) {
        shoppingLogRepository.deleteById(id);
    }
}