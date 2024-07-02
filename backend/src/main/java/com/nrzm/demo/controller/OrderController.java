package com.nrzm.demo.controller;

import com.nrzm.demo.dto.OrderDTO;
import com.nrzm.demo.dto.OrderItemDTO;
import com.nrzm.demo.entity.Member;
import com.nrzm.demo.entity.Order;
import com.nrzm.demo.entity.OrderItem;
import com.nrzm.demo.service.MemberService;
import com.nrzm.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private MemberService memberService;

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<OrderDTO> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sort) {

        Sort.Direction direction = Sort.Direction.DESC; // 기본값으로 내림차순 정렬
        String[] sortParams = sort.split(",");
        if (sortParams.length > 1) {
            direction = sortParams[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        Page<Order> ordersPage = orderService.getAllOrders(pageable);
        return convertToOrderDTOPage(ordersPage);
    }

    @GetMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = orderService.saveOrder(order);
        return ResponseEntity.ok(savedOrder);
    }

    @PutMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order existingOrder = orderService.getOrderById(id);
        if (existingOrder == null) {
            return ResponseEntity.notFound().build();
        }
        order.setOrderId(id);
        Order updatedOrder = orderService.saveOrder(order);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        Order existingOrder = orderService.getOrderById(id);
        if (existingOrder == null) {
            return ResponseEntity.notFound().build();
        }
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }

    private Page<OrderDTO> convertToOrderDTOPage(Page<Order> ordersPage) {
        List<OrderDTO> orderDTOs = ordersPage.getContent().stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(orderDTOs, ordersPage.getPageable(), ordersPage.getTotalElements());
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getOrderId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setOrderDate(order.getOrderDate());
        dto.setUsername(order.getMember().getUsername());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatusKo(order.getStatus().getDescription());

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertToOrderItemDTO)
                .collect(Collectors.toList());

        dto.setOrderItems(itemDTOs);

        return dto;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem item) {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setId(item.getOrderItemId());
        itemDTO.setProductName(item.getProduct().getName());
        itemDTO.setQuantity(item.getQuantity());
        itemDTO.setPrice(item.getPrice());
        return itemDTO;
    }

    @GetMapping("/api/orders")
    @PreAuthorize("hasRole('MEMBER')")
    public Page<OrderDTO> getAllOrdersByMemberId(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sort) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Member member = memberService.getMemberByUsername(username);

        if (member == null) {
            throw new UsernameNotFoundException("존재하지 않는 Member 입니다. " + username);
        }

        Sort.Direction direction = Sort.Direction.DESC; // 기본값으로 내림차순 정렬
        String[] sortParams = sort.split(",");
        if (sortParams.length > 1) {
            direction = sortParams[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        Page<Order> ordersPage = orderService.getAllOrdersByMember(member, pageable);
        return convertToOrderDTOPage(ordersPage);
    }
}