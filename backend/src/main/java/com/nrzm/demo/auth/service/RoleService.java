package com.nrzm.demo.auth.service;

import com.nrzm.demo.auth.dto.RoleDTO;
import com.nrzm.demo.auth.entity.Role;
import com.nrzm.demo.auth.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public Role updateRole(Long id, Role role) throws Exception {
        Role existingRole = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found: " + id));
        existingRole.setName(role.getName());
        return roleRepository.save(existingRole);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));

        try {
            roleRepository.delete(role);
            roleRepository.flush(); // 즉시 DB 반영을 강제합니다.
        } catch (DataIntegrityViolationException e) {
            throw new RoleDeletionException("사용 중인 역할이 있어 삭제할 수 없습니다.");
        }
    }

    private RoleDTO convertToDTO(Role role) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setName(role.getName());
        return roleDTO;
    }
}
