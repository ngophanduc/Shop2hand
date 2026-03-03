package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Product> findByCategoryIdAndTitleContainingIgnoreCase(Long categoryId, String title);

    List<Product> findByCategoryIdAndTitleContainingIgnoreCaseOrCategoryIdAndDescriptionContainingIgnoreCase(
            Long catId1, String title, Long catId2, String description);
}
