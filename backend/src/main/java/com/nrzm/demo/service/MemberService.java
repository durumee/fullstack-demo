package com.nrzm.demo.service;

import com.nrzm.demo.dto.MemberDTO;
import com.nrzm.demo.entity.Member;
import com.nrzm.demo.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<MemberDTO> getMembers(Pageable pageable, String status) {
        Page<Member> memberPage;
        if ("ACTIVE".equals(status)) {
            memberPage = memberRepository.findByIsDeletedFalse(pageable);
        } else if ("DELETED".equals(status)) {
            memberPage = memberRepository.findByIsDeletedTrue(pageable);
        } else {
            memberPage = memberRepository.findAll(pageable);
        }
        return memberPage.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Member getMemberByUsername(String username) {
        return memberRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Member not found with username: " + username));
    }

    @Transactional(readOnly = true)
    public Member getMemberById(Long id) {
        return memberRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public MemberDTO getMemberDTOById(Long id) {
        Member member = getMemberById(id);
        if (member == null) {
            throw new EntityNotFoundException("Member not found with id: " + id);
        }
        return convertToDTO(member);
    }

    @Transactional(readOnly = true)
    public MemberDTO getMemberDTOByUsername(String username) {
        Member member = getMemberByUsername(username);
        return convertToDTO(member);
    }

    @Transactional
    public MemberDTO addMember(MemberDTO memberDTO) {
        Member member = convertToEntity(memberDTO);
        member.setIsDeleted(false);
        Member savedMember = memberRepository.save(member);
        return convertToDTO(savedMember);
    }

    @Transactional
    public MemberDTO updateMember(Long id, MemberDTO memberDTO) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));

        if (memberDTO.getUsername() != null) member.setUsername(memberDTO.getUsername());
        if (memberDTO.getEmail() != null) member.setEmail(memberDTO.getEmail());
        if (memberDTO.getPhoneNumber() != null) member.setPhoneNumber(memberDTO.getPhoneNumber());
        if (memberDTO.getAddress() != null) member.setAddress(memberDTO.getAddress());
        if (memberDTO.getIsDeleted() != null) member.setIsDeleted(memberDTO.getIsDeleted());

        Member updatedMember = memberRepository.save(member);
        return convertToDTO(updatedMember);
    }

    @Transactional
    public MemberDTO deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
        member.setIsDeleted(true);
        Member deletedMember = memberRepository.save(member);
        return convertToDTO(deletedMember);
    }

    @Transactional
    public MemberDTO restoreMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
        member.setIsDeleted(false);
        Member restoredMember = memberRepository.save(member);
        return convertToDTO(restoredMember);
    }

    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setMemberId(member.getMemberId());
        dto.setUsername(member.getUsername());
        dto.setEmail(member.getEmail());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setAddress(member.getAddress());
        dto.setIsDeleted(member.getIsDeleted());
        return dto;
    }

    private Member convertToEntity(MemberDTO dto) {
        Member member = new Member();
        member.setUsername(dto.getUsername());
        member.setEmail(dto.getEmail());
        member.setPhoneNumber(dto.getPhoneNumber());
        member.setAddress(dto.getAddress());
        return member;
    }
}