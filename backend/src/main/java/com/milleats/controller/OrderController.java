package com.milleats.controller;

import com.milleats.dto.OrderItemDto;
import com.milleats.dto.OrderRequestDto;
import com.milleats.model.Order;
import com.milleats.model.OrderItem;
import com.milleats.model.Product;
import com.milleats.repository.OrderRepository;
import com.milleats.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemDto itemDto : request.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemDto.getProductId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDto.getQuantity());
                orderItem.setPriceAtPurchase(product.getPrice());

                order.addItem(orderItem);

                total = total.add(product.getPrice().multiply(new BigDecimal(itemDto.getQuantity())));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Product ID " + itemDto.getProductId() + " not found.");
            }
        }

        order.setTotalAmount(total);
        order.setOrderDate(LocalDateTime.now()); // Set manually since columnDefinition is generic timestamp

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with id " + id);
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
