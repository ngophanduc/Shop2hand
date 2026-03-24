package com.example.demo.config;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCategories(CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ProductImageRepository productImageRepository) {
        return args -> {
            List<String> allowedCategories = Arrays.asList(
                    "Shirt", "Gloves", "Shoes", "Hat", "Glasses", "Pants", "Bags");

            // 1. Find and delete categories not in the allowed list
            List<Category> allCategories = categoryRepository.findAll();
            for (Category cat : allCategories) {
                if (!allowedCategories.contains(cat.getName())) {
                    // Optimized: Use a single update query to set category to null
                    productRepository.updateCategoryToNull(cat.getId());
                    categoryRepository.delete(cat);
                }
            }

            // 2. Ensure each allowed category exists in the database
            for (String categoryName : allowedCategories) {
                if (categoryRepository.findByName(categoryName).isEmpty()) {
                    categoryRepository.save(Category.builder().name(categoryName).build());
                }
            }

            // 3. Data Migration: Ensure all products have a status using a bulk update
            productRepository.updateNullStatusToAvailable();
        };
    }
}
