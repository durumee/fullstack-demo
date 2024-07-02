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
import java.util.List;

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
        Product product3 = createProduct("태블릿", "고해상도 태블릿", new BigDecimal("800000"), 30, 3);
        Product product4 = createProduct("스마트워치", "다양한 기능의 스마트워치", new BigDecimal("300000"), 200, 4);
        Product product5 = createProduct("이어폰", "무선 이어폰", new BigDecimal("150000"), 500, 5);
        Product product6 = createProduct("모니터", "4K 모니터", new BigDecimal("400000"), 20, 6);
        Product product7 = createProduct("키보드", "기계식 키보드", new BigDecimal("100000"), 150, 7);
        Product product8 = createProduct("마우스", "무선 마우스", new BigDecimal("50000"), 300, 8);

        productRepository.saveAll(Arrays.asList(product1, product2, product3, product4, product5, product6, product7, product8));
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
        Member member1 = createMember("이성계", passwordEncoder.encode("lee123"), "lsg@email.com", "010-1234-5678", "전라북도 전주시");
        Member member2 = createMember("정도전", passwordEncoder.encode("jeong123"), "jdj@email.com", "010-1234-5432", "경상북도 영천시");
        Member member3 = createMember("이순신", passwordEncoder.encode("lee123"), "lss@email.com", "010-1234-1357", "서울특별시 중구");
        Member member4 = createMember("한명회", passwordEncoder.encode("han123"), "hmh@email.com", "010-1234-2468", "경기도 여주시");
        Member member5 = createMember("박연", passwordEncoder.encode("park123"), "py@email.com", "010-1234-5214", "충청남도 논산시");
        Member member6 = createMember("황희", passwordEncoder.encode("hwang123"), "hh@email.com", "010-1234-9514", "서울특별시 서대문구");
        Member member7 = createMember("성삼문", passwordEncoder.encode("sung123"), "ssm@email.com", "010-1234-7531", "서울특별시 성북구");
        Member member8 = createMember("윤두수", passwordEncoder.encode("yun123"), "yds@email.com", "010-1234-8523", "경기도 광주시");
        Member member9 = createMember("신숙주", passwordEncoder.encode("shin123"), "ssj@email.com", "010-1234-9638", "경기도 남양주시");
        Member member10 = createMember("이항", passwordEncoder.encode("lee123"), "lh@email.com", "010-1234-7412", "경기도 포천시");

        memberRepository.saveAll(Arrays.asList(member1, member2, member3, member4, member5, member6, member7, member8, member9, member10));
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
        order.setOrderNumber("1");
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(product.getPrice());
        order.setStatus(Order.OrderStatus.SHIPPED);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setPrice(product.getPrice());

        order.setOrderItems(Arrays.asList(orderItem));

        orderRepository.save(order);
    }

    private void initShoppingLogs(ShoppingLogRepository shoppingLogRepository, MemberRepository memberRepository) {
        List<Member> members = memberRepository.findAll();

        ShoppingLog log1 = createShoppingLog(members.get(0), "내 첫 노트북 구매기", "오늘 드디어 노트북을 샀습니다. 가격은 비쌌지만 성능이 정말 좋아요!");
        ShoppingLog log2 = createShoppingLog(members.get(0), "스마트폰 비교 후기", "여러 스마트폰을 비교해보고 최종적으로 선택한 제품에 대한 후기입니다.");
        ShoppingLog log3 = createShoppingLog(members.get(1), "태블릿 사용기", "새로 구입한 태블릿을 일주일간 사용해본 후기입니다. 화면이 정말 선명해요.");
        ShoppingLog log4 = createShoppingLog(members.get(1), "스마트워치 구매 후기", "스마트워치를 구매했는데 다양한 기능이 있어서 만족합니다.");
        ShoppingLog log5 = createShoppingLog(members.get(2), "무선 이어폰 체험기", "무선 이어폰을 사용해보니 정말 편리합니다. 소리도 좋아요.");
        ShoppingLog log6 = createShoppingLog(members.get(2), "4K 모니터 사용 후기", "4K 모니터를 사용하니 영상이 정말 선명하고 좋아요.");
        ShoppingLog log7 = createShoppingLog(members.get(3), "기계식 키보드 후기", "기계식 키보드를 처음 써봤는데 타건감이 정말 좋습니다.");
        ShoppingLog log8 = createShoppingLog(members.get(3), "무선 마우스 사용기", "무선 마우스를 사용하니 책상이 깔끔해졌습니다.");
        ShoppingLog log9 = createShoppingLog(members.get(4), "노트북 비교", "여러 노트북을 비교해보고 선택한 제품에 대한 솔직한 후기입니다.");
        ShoppingLog log10 = createShoppingLog(members.get(4), "스마트폰 초기 설정", "스마트폰을 처음 설정하는 과정에서 겪은 일들을 공유합니다.");
        ShoppingLog log11 = createShoppingLog(members.get(5), "태블릿과 노트북 비교", "태블릿과 노트북의 장단점을 비교해본 후기입니다.");
        ShoppingLog log12 = createShoppingLog(members.get(5), "스마트워치의 유용성", "스마트워치가 일상생활에서 얼마나 유용한지에 대해 작성했습니다.");
        ShoppingLog log13 = createShoppingLog(members.get(6), "무선 이어폰 배터리 수명", "무선 이어폰의 배터리 수명에 대해 이야기해봅니다.");
        ShoppingLog log14 = createShoppingLog(members.get(6), "4K 모니터 게임 체험기", "4K 모니터로 게임을 해본 후기입니다. 몰입감이 장난 아닙니다.");
        ShoppingLog log15 = createShoppingLog(members.get(7), "기계식 키보드 장단점", "기계식 키보드를 사용하면서 느낀 장단점을 공유합니다.");
        ShoppingLog log16 = createShoppingLog(members.get(7), "무선 마우스의 장점", "무선 마우스를 사용하면서 느낀 장점을 소개합니다.");
        ShoppingLog log17 = createShoppingLog(members.get(8), "노트북 배터리 관리 팁", "노트북의 배터리를 오래 사용하기 위한 관리 팁을 공유합니다.");

        shoppingLogRepository.saveAll(Arrays.asList(log1, log2, log3, log4, log5, log6, log7, log8, log9, log10, log11, log12, log13, log14, log15, log16, log17));
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