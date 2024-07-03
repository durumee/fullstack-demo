package com.nrzm.demo.dto;

import lombok.Data;

@Data
public class MemberDTO {
    private Long memberId;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String address;
    private Boolean isDeleted;
}