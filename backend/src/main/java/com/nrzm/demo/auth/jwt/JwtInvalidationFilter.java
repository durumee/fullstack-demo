package com.nrzm.demo.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtInvalidationFilter extends OncePerRequestFilter {

    private static final String INVALIDATION_PATH = "/invalidate-token";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 지정된 경로가 아니면 필터 동작을 수행하지 않음
        return !INVALIDATION_PATH.equals(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // 리프레시 토큰 쿠키 삭제
            removeRefreshTokenCookie(response);

            response.setStatus(HttpServletResponse.SC_OK);
            return; // 필터 체인 중단
        }

        // 다른 모든 요청에 대해서는 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    private void removeRefreshTokenCookie(HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }
}