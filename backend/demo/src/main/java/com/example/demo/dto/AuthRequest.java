package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {
    @NotBlank(message = "Username is required / Tên đăng nhập không được để trống")
    private String username;

    @Email(message = "Invalid email format / Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Password is required / Mật khẩu không được để trống")
    @Size(min = 6, message = "Password must be at least 6 characters / Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
}
