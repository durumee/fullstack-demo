package com.nrzm.demo.controller;

import com.nrzm.demo.dto.MemberDTO;
import com.nrzm.demo.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
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
    public ResponseEntity<Page<MemberDTO>> getMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "ALL") String status) {
        Page<MemberDTO> members = memberService.getMembers(PageRequest.of(page, size), status);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/admin/members/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MemberDTO> getMember(@PathVariable Long id) {
        try {
            MemberDTO memberDTO = memberService.getMemberDTOById(id);
            return ResponseEntity.ok(memberDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MemberDTO> createMember(@RequestBody MemberDTO memberDTO) {
        MemberDTO savedMember = memberService.addMember(memberDTO);
        return ResponseEntity.ok(savedMember);
    }

    @PutMapping("/admin/members/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @RequestBody MemberDTO memberDTO) {
        try {
            MemberDTO updatedMember = memberService.updateMember(id, memberDTO);
            return ResponseEntity.ok(updatedMember);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MemberDTO());
        }
    }

    @GetMapping("/api/member")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<MemberDTO> getMemberInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            MemberDTO memberDTO = memberService.getMemberDTOByUsername(username);
            memberDTO.setPassword(null); // 비밀번호와 같은 민감한 정보는 제거
            return ResponseEntity.ok(memberDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}