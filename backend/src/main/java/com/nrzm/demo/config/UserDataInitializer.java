package com.nrzm.demo.config;

import com.nrzm.demo.auth.entity.Role;
import com.nrzm.demo.auth.entity.User;
import com.nrzm.demo.auth.repository.RoleRepository;
import com.nrzm.demo.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@Transactional
@Profile("dev") // 개발 프로파일에서만 실행되도록 설정 (CLI Run Config, --spring.profiles.active=dev)
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // ROLE_USER 저장 또는 조회
        Role roleUser = getOrCreateRole("ROLE_USER");

        // ROLE_ADMIN 저장 또는 조회
        Role roleAdmin = getOrCreateRole("ROLE_ADMIN");

        createUserIfNotExists("user", "qwaszx", Set.of(roleUser));
        createUserIfNotExists("admin", "qwaszx", Set.of(roleUser, roleAdmin));
    }

    private Role getOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(roleName);
                    return roleRepository.save(newRole);
                });
    }

    private void createUserIfNotExists(String username, String password, Set<Role> roles) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRoles(roles);
            userRepository.save(user);
        }
    }
}