package com.nrzm.demo.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtInvalidationFilter extends OncePerRequestFilter {

    private static final String INVALIDATION_PATH = "/invalidate-token";
    private final JwtProvider jwtProvider;

    public JwtInvalidationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 지정된 경로가 아니면 필터 동작을 수행하지 않음
        return !INVALIDATION_PATH.equals(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String bearerToken = jwtProvider.resolveToken(request);

        if (bearerToken != null) {
            // 리프레시 토큰 쿠키 삭제
            jwtProvider.removeRefreshTokenCookie(response, bearerToken);

            response.setStatus(HttpServletResponse.SC_OK);
            response.setHeader("Cache-Control", "no-store");    // 브라우저에서 응답 정보를 캐시하지 않도록 설정
            return; // 필터 체인 중단
        }

        // 다른 모든 요청에 대해서는 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }
}
