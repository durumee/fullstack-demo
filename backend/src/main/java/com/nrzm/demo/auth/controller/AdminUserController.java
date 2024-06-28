package com.nrzm.demo.auth.controller;

import com.nrzm.demo.auth.dto.UserDTO;
import com.nrzm.demo.auth.entity.Role;
import com.nrzm.demo.auth.entity.User;
import com.nrzm.demo.auth.repository.RoleRepository;
import com.nrzm.demo.auth.service.CustomUserDetailsService;
import com.nrzm.demo.auth.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@Transactional
public class AdminUserController {
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userDetailsService.createUser(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userDetailsService.loadUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<UserDTO> getAllUsers() {
        return userDetailsService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userDetailsService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userDetailsService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<Void> deleteUserRole(@PathVariable Long userId, @PathVariable Long roleId) {
        try {
            userDetailsService.removeRoleFromUser(userId, roleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
