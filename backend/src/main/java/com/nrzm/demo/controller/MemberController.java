package com.nrzm.demo.controller;

import com.nrzm.demo.entity.Member;
import com.nrzm.demo.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/admin/members")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<Member> getAllMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return memberService.getAllMembers(PageRequest.of(page, size));
    }

    @GetMapping("/admin/members/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        Member member = memberService.getMemberById(id);
        if (member != null) {
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.saveMember(member);
        return ResponseEntity.ok(savedMember);
    }

    @PutMapping("/admin/members/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        Member existingMember = memberService.getMemberById(id);
        if (existingMember == null) {
            return ResponseEntity.notFound().build();
        }
        member.setMemberId(id);
        Member updatedMember = memberService.saveMember(member);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/admin/members/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        Member existingMember = memberService.getMemberById(id);
        if (existingMember == null) {
            return ResponseEntity.notFound().build();
        }
        memberService.deleteMember(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/member")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Member> getMemberInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Member member = memberService.getMemberByUsername(username);
        if (member != null) {
            // 비밀번호와 같은 민감한 정보는 제거
            member.setPassword(null);
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}