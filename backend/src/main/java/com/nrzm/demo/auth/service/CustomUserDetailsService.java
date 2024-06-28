package com.nrzm.demo.auth.service;

import com.nrzm.demo.auth.dto.RoleDTO;
import com.nrzm.demo.auth.dto.UserDTO;
import com.nrzm.demo.auth.entity.Role;
import com.nrzm.demo.auth.entity.User;
import com.nrzm.demo.auth.repository.RoleRepository;
import com.nrzm.demo.auth.repository.UserRepository;
import com.nrzm.demo.entity.Member;
import com.nrzm.demo.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(UserRepository userRepository, MemberRepository memberRepository, RoleRepository roleRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 먼저 User(관리자) 테이블에서 검색
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Set<GrantedAuthority> authorities = user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                    .collect(Collectors.toSet());
            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
        }

        // User 테이블에 없으면 Member 테이블에서 검색
        Optional<Member> memberOptional = memberRepository.findByEmail(username);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            Set<GrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_MEMBER"));
            return new org.springframework.security.core.userdetails.User(member.getEmail(), member.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found with username or email: " + username);
    }

    public UsernamePasswordAuthenticationToken getAuthenticationToken(String usernameFromToken, HttpServletRequest request) {
        UserDetails userDetails = this.loadUserByUsername(usernameFromToken);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return authentication;
    }

    @Transactional(readOnly = true)
    public Optional<User> loadUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setRoles(user.getRoles().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
        return userDTO;
    }

    private RoleDTO convertToDTO(Role role) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setName(role.getName());
        return roleDTO;
    }

    @Transactional
    public User createUser(User user) {
        // 비밀번호 인코딩
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 역할 설정
        Set<Role> roles = new HashSet<>();
        for (Role role : user.getRoles()) {
            Role existingRole = roleRepository.findByName(role.getName())
                    .orElseGet(() -> roleRepository.save(new Role(role.getName())));
            roles.add(existingRole);
        }
        user.setRoles(roles);

        // 사용자 저장
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            user.setRoles(userDetails.getRoles());
            return userRepository.save(user);
        }).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        if (user.getRoles().remove(role)) {
            role.getUsers().remove(user);
            userRepository.save(user);
            roleRepository.save(role);
        } else {
            throw new RuntimeException("User does not have the specified role");
        }
    }
}
