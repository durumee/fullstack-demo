package com.nrzm.demo.dto;

import lombok.Data;
import com.nrzm.demo.entity.Order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String username;
    private List<OrderItemDTO> orderItems;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String statusKo;
}