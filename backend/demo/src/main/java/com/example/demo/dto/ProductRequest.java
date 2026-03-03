package com.example.demo.dto;

import com.example.demo.entity.Product;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private Product.ConditionStatus conditionStatus;
    private Long categoryId;
    private Product.Status status;
    private List<String> imageUrls;
}
