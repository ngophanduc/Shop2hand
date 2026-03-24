package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Full name is required / Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Address is required / Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Phone number is required / Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Invalid phone number / Số điện thoại không hợp lệ")
    private String phone;

    private String note;
}
