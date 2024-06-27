package com.nrzm.demo.auth.jwt;

import com.nrzm.demo.auth.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    //JWT 인증 필터가 필요한 경로
    private static final Set<String> FILTER_URIS = Set.of(
            "/admin",
            "/api"
    );

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(@Lazy JwtProvider jwtProvider, @Lazy CustomUserDetailsService userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String reqURI = request.getRequestURI();

        for (String uri : FILTER_URIS) {
            if (reqURI.startsWith(uri)) {
                // 필터 대상 URI 인 경우, 인증처리하도록 false 반환
                return false;
            }
        }

        // 대상 URI 아닌 경우 필터 처리 제외를 위해 true 반환
        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String accessToken = jwtProvider.resolveToken(request);

            if (accessToken != null && jwtProvider.validateToken(accessToken)) {
                setAuthentication(accessToken, request);
            } else {
                String usernameFromExpiredToken = jwtProvider.getSubjectFromExpiredToken(accessToken);
                handleRefreshToken(request, response, usernameFromExpiredToken);
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "인증에 문제가 있습니다. Authentication failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(String token, HttpServletRequest request) {
        String usernameFromToken = jwtProvider.getUsernameFromToken(token);
        UsernamePasswordAuthenticationToken authenticationToken = userDetailsService.getAuthenticationToken(usernameFromToken, request);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

    private void handleRefreshToken(HttpServletRequest request, HttpServletResponse response, String usernameFromExpiredToken) throws IOException {
        String refreshToken = jwtProvider.resolveRefreshToken(request, usernameFromExpiredToken);
        if (refreshToken != null && jwtProvider.validateToken(refreshToken)) {
            String username = jwtProvider.getUsernameFromToken(refreshToken);
            String newAccessToken = jwtProvider.createToken(username);
            response.setHeader("Authorization", "Bearer " + newAccessToken);
            setAuthentication(newAccessToken, request);
        } else if (refreshToken != null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "갱신용 토큰 정보에 문제가 있습니다. Refresh token is invalid or expired");
        }
    }
}
