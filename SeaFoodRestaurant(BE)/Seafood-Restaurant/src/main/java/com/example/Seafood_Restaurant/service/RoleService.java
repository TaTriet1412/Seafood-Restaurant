package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.Role;
import com.example.Seafood_Restaurant.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;


@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles () {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        for(Role role:getAllRoles()) {
            if(Objects.equals(role.getId(), id)) return role;
        }
        return null;
    }

    public Role getRoleByName(String name) {
        for(Role role:getAllRoles()) {
            if(role.getName().equalsIgnoreCase(name)) return role;
        }
        throw new RuntimeException("Vai trò không khả dụng. (không phân biệt hoa thường)");
    }
}

