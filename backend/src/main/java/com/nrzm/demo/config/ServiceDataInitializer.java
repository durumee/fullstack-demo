package com.nrzm.demo.config;

import com.nrzm.demo.entity.*;
import com.nrzm.demo.repository.MemberRepository;
import com.nrzm.demo.repository.OrderRepository;
import com.nrzm.demo.repository.ProductRepository;
import com.nrzm.demo.repository.ShoppingLogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
@Profile("dev")
public class ServiceDataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository,
                                      MemberRepository memberRepository,
                                      OrderRepository orderRepository,
                                      ShoppingLogRepository shoppingLogRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            initProducts(productRepository);
            initMembers(memberRepository, passwordEncoder);
            initOrders(orderRepository, memberRepository, productRepository);
            initShoppingLogs(shoppingLogRepository, memberRepository);
        };
    }

    private void initProducts(ProductRepository productRepository) {
        Product product1 = createProduct("노트북", "고성능 노트북", new BigDecimal("1500000"), 50, 1);
        Product product2 = createProduct("스마트폰", "최신형 스마트폰", new BigDecimal("1000000"), 100, 2);
        productRepository.saveAll(Arrays.asList(product1, product2));
    }

    private Product createProduct(String name, String description, BigDecimal price, int stockQuantity, int categoryId) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setCategoryId(categoryId);
        return product;
    }

    private void initMembers(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        Member member1 = createMember("홍길동", passwordEncoder.encode("password123"), "hong@example.com", "010-1234-5678", "서울시 강남구");
        Member member2 = createMember("김철수", passwordEncoder.encode("password456"), "kim@example.com", "010-9876-5432", "서울시 마포구");
        Member member3 = createMember("이영희", passwordEncoder.encode("password789"), "lee@example.com", "010-2468-1357", "부산시 해운대구");
        Member member4 = createMember("박지성", passwordEncoder.encode("passwordabc"), "park@example.com", "010-1357-2468", "인천시 연수구");
        Member member5 = createMember("최민수", passwordEncoder.encode("passworddef"), "choi@example.com", "010-3698-5214", "대전시 유성구");
        Member member6 = createMember("정소연", passwordEncoder.encode("passwordghi"), "jung@example.com", "010-7531-9514", "광주시 서구");
        memberRepository.saveAll(Arrays.asList(member1, member2, member3, member4, member5, member6));
    }

    private Member createMember(String username, String password, String email, String phoneNumber, String address) {
        Member member = new Member();
        member.setUsername(username);
        member.setPassword(password);
        member.setEmail(email);
        member.setPhoneNumber(phoneNumber);
        member.setAddress(address);
        return member;
    }

    private void initOrders(OrderRepository orderRepository, MemberRepository memberRepository, ProductRepository productRepository) {
        Member member = memberRepository.findAll().get(0);
        Product product = productRepository.findAll().get(0);

        Order order = new Order();
        order.setMember(member);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(product.getPrice());

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setPrice(product.getPrice());

        order.setOrderItems(Arrays.asList(orderItem));

        orderRepository.save(order);
    }

    private void initShoppingLogs(ShoppingLogRepository shoppingLogRepository, MemberRepository memberRepository) {
        Member member = memberRepository.findAll().get(0);

        ShoppingLog log1 = createShoppingLog(member, "내 첫 노트북 구매기", "오늘 드디어 노트북을 샀습니다. 가격은 비쌌지만 성능이 정말 좋아요!");
        ShoppingLog log2 = createShoppingLog(member, "스마트폰 비교 후기", "여러 스마트폰을 비교해보고 최종적으로 선택한 제품에 대한 후기입니다.");

        shoppingLogRepository.saveAll(Arrays.asList(log1, log2));
    }

    private ShoppingLog createShoppingLog(Member member, String title, String content) {
        ShoppingLog log = new ShoppingLog();
        log.setMember(member);
        log.setTitle(title);
        log.setContent(content);
        log.setCreatedAt(LocalDateTime.now());
        log.setUpdatedAt(LocalDateTime.now());
        return log;
    }
}