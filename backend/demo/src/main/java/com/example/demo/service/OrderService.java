package com.example.demo.service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order createOrder(OrderRequest request, User buyer) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus() != Product.Status.AVAILABLE) {
            throw new RuntimeException("Product is already sold or unavailable");
        }

        // Update product status to SOLD
        product.setStatus(Product.Status.SOLD);
        productRepository.save(product);

        Order order = Order.builder()
                .buyer(buyer)
                .product(product)
                .priceAtPurchase(product.getPrice())
                .fullName(request.getFullName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .note(request.getNote())
                .status(Order.OrderStatus.PENDING)
                .build();

        return orderRepository.save(order);
    }
}
