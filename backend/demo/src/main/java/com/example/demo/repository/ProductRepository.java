package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @EntityGraph(attributePaths = { "seller", "category", "images" })
    List<Product> findAll();

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    List<Product> findByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    List<Product> findByCategoryIdAndTitleContainingIgnoreCaseOrCategoryIdAndDescriptionContainingIgnoreCase(
            Long catId1, String title, Long catId2, String description);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.category = null WHERE p.category.id = :categoryId")
    void updateCategoryToNull(Long categoryId);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.status = 'AVAILABLE' WHERE p.status IS NULL")
    void updateNullStatusToAvailable();
}
