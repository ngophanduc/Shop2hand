package com.example.demo.dto;

import com.example.demo.entity.Product;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Product.ConditionStatus conditionStatus;
    private Product.Status status;
    private Long sellerId;
    private String sellerName;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls;
    private String createdAt;
}
