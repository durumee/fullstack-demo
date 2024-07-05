package com.nrzm.demo.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;

import static com.nrzm.demo.config.CookieConstants.REFRESH_TOKEN_PREFIX;

@Component
public class JwtProvider {
    @Value("${jwt.secret:your-very-long-secret-key-that-is-at-least-64-bytes-long-0123456789abcdef0123456789abcdef}")
    private String secret;
    @Value("${jwt.expiration:300000}") //5분:300000
    private long expiration;
    @Value("${jwt.expiration:3600000}") //1시간:3600000, 30초:30000
    private long refreshExpiration;
    private SecretKey secretKey;

    @PostConstruct
    protected void init() {
        if (secret.length() < 64) {
            throw new IllegalArgumentException("The secret key length must be at least 64 bytes for HS512 algorithm");
        }
        this.secretKey = new SecretKeySpec(secret.getBytes(), Jwts.SIG.HS512.key().build().getAlgorithm());
    }

    //액세스 토큰
    public String createToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
        } catch (JwtException jwtException) {
            // parseSignedClaims 수행 시 인증이 만료된 경우 JwtException 발생함
            return false;
        }

        return true;
    }

    public String getSubjectFromExpiredToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
        } catch (ExpiredJwtException expiredJwtException) {
            // 토큰이 만료된 경우, 예외 객체에서 클레임 정보를 추출
            Claims claims = expiredJwtException.getClaims();
            return claims.getSubject();
        } catch (JwtException jwtException) {
            // parseSignedClaims 수행 시 인증이 만료된 경우 JwtException 발생함
            return "";
        }

        return "";
    }

    public String createRefreshTokenCookieName(String username) {
        String combinedString = username + secret;

        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            byte[] hash = digest.digest(combinedString.getBytes());
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error creating refresh token cookie name", e);
        }
    }

    public String resolveRefreshToken(HttpServletRequest request, String usernameFromExpiredToken) {
        Cookie[] cookies = request.getCookies();
        String cookieName = REFRESH_TOKEN_PREFIX + createRefreshTokenCookieName(usernameFromExpiredToken);

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    public void removeRefreshTokenCookie(HttpServletResponse response, String bearerToken) {
        String username = getSubjectFromExpiredToken(bearerToken);
        String cookieName = REFRESH_TOKEN_PREFIX + createRefreshTokenCookieName(username);
        Cookie refreshTokenCookie = new Cookie(cookieName, null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }
}
