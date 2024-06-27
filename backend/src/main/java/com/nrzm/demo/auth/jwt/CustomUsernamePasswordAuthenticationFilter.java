package com.nrzm.demo.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nrzm.demo.auth.jwt.JwtProvider;
import com.nrzm.demo.auth.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class CustomUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    @Value("${jwt.secret:your-very-long-secret-key-that-is-at-least-64-bytes-long-0123456789abcdef0123456789abcdef}")
    private String secret;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private ObjectMapper objectMapper;

    public CustomUsernamePasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        // 요청으로부터 사용자명과 비밀번호를 직접 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        // 사용자명 또는 비밀번호가 없을 경우 예외 처리
        if (username == null || password == null) {
            throw new BadCredentialsException("Username or password is null") {
            };
        }

        // 인증 요청 객체 생성
        UsernamePasswordAuthenticationToken authRequest = UsernamePasswordAuthenticationToken.unauthenticated(
                username, password);

        // 요청 상세 설정
        setDetails(request, authRequest);

        // AuthenticationManager를 사용하여 인증 시도
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();

        // JWT 토큰 생성
        String token = jwtProvider.createToken(userDetails.getUsername());

        // 리프레시 토큰 생성 및 쿠키에 추가
        String refreshToken = jwtProvider.createRefreshToken(userDetails.getUsername());
        String cookieName = jwtProvider.createRefreshTokenCookieName(userDetails.getUsername());
        Cookie refreshTokenCookie = new Cookie("refreshToken_" + cookieName, refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        response.addCookie(refreshTokenCookie);

        // JSON 응답 생성
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "Authentication successful");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Authorization", "Bearer " + token);
        objectMapper.writeValue(response.getWriter(), responseBody);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("error", "Authentication failed");
        responseBody.put("message", failed.getMessage());

        objectMapper.writeValue(response.getWriter(), responseBody);
    }

}