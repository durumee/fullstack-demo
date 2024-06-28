package com.nrzm.demo.controller;

import com.nrzm.demo.entity.Member;
import com.nrzm.demo.entity.ShoppingLog;
import com.nrzm.demo.service.MemberService;
import com.nrzm.demo.service.ShoppingLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/shopping-logs")
public class ShoppingLogController {

    @Autowired
    private ShoppingLogService shoppingLogService;

    @Autowired
    private MemberService memberService;

    // 관리자: 모든 쇼핑 로그 조회
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ShoppingLog> getAllShoppingLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return shoppingLogService.getAllShoppingLogs(PageRequest.of(page, size));
    }

    // 관리자: 쇼핑 로그 삭제
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShoppingLog(@PathVariable Long id) {
        shoppingLogService.deleteShoppingLog(id);
        return ResponseEntity.ok().build();
    }

    // 일반 회원: 자신의 쇼핑 로그 조회
    @GetMapping("/api/member")
    @PreAuthorize("hasRole('MEMBER')")
    public Page<ShoppingLog> getMemberShoppingLogs(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String username = principal.getName();
        Member member = memberService.getMemberByUsername(username);
        return shoppingLogService.getShoppingLogsByMember(member, PageRequest.of(page, size));
    }

    // 일반 회원: 쇼핑 로그 등록
    @PostMapping("/api/member")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ShoppingLog> createShoppingLog(@RequestBody ShoppingLog shoppingLog, Principal principal) {
        String username = principal.getName();
        Member member = memberService.getMemberByUsername(username);
        shoppingLog.setMember(member);
        ShoppingLog savedLog = shoppingLogService.saveShoppingLog(shoppingLog);
        return ResponseEntity.ok(savedLog);
    }

    // 일반 회원: 쇼핑 로그 수정
    @PutMapping("/api/member/{id}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ShoppingLog> updateShoppingLog(@PathVariable Long id, @RequestBody ShoppingLog shoppingLog, Principal principal) {
        String username = principal.getName();
        Member member = memberService.getMemberByUsername(username);
        ShoppingLog existingLog = shoppingLogService.getShoppingLogById(id);
        
        if (existingLog == null || !existingLog.getMember().equals(member)) {
            return ResponseEntity.notFound().build();
        }
        
        shoppingLog.setId(id);
        shoppingLog.setMember(member);
        ShoppingLog updatedLog = shoppingLogService.saveShoppingLog(shoppingLog);
        return ResponseEntity.ok(updatedLog);
    }
}