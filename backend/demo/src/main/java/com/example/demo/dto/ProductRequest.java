package com.example.demo.dto;

import com.example.demo.entity.Product;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Title is required / Tiêu đề không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Price is required / Giá không được để trống")
    @Min(value = 0, message = "Price must be non-negative / Giá không được âm")
    private BigDecimal price;

    @NotNull(message = "Condition status is required")
    private Product.ConditionStatus conditionStatus;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Product.Status status;
    private List<String> imageUrls;
    private String size;
}
