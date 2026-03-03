package com.example.demo.service;

import com.example.demo.dto.ProductRequest;
import com.example.demo.dto.ProductResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<ProductResponse> getAllProducts(Long categoryId, String search) {
        List<Product> products;
        boolean hasSearch = search != null && !search.trim().isEmpty();

        if (categoryId != null && hasSearch) {
            products = productRepository
                    .findByCategoryIdAndTitleContainingIgnoreCaseOrCategoryIdAndDescriptionContainingIgnoreCase(
                            categoryId, search, categoryId, search);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId);
        } else if (hasSearch) {
            products = productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search,
                    search);
        } else {
            products = productRepository.findAll();
        }
        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request,
            List<org.springframework.web.multipart.MultipartFile> imageFiles) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User seller = userRepository.findByUsername(username).orElseThrow();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .conditionStatus(request.getConditionStatus())
                .status(Product.Status.AVAILABLE)
                .seller(seller)
                .category(category)
                .build();

        product = productRepository.save(product);

        if (imageFiles != null && !imageFiles.isEmpty()) {
            Product finalProduct = product;
            List<ProductImage> images = imageFiles.parallelStream().map(file -> {
                try {
                    String url = cloudinaryService.uploadImage(file);
                    return ProductImage.builder().product(finalProduct).imageUrl(url).build();
                } catch (java.io.IOException e) {
                    throw new RuntimeException("Image upload failed", e);
                }
            }).collect(Collectors.toList());
            productImageRepository.saveAll(images);
            product.setImages(images);
        }

        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request,
            List<org.springframework.web.multipart.MultipartFile> imageFiles) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // For simplicity in this demo, we allow any ADMIN to update any product
        // SecurityConfig already ensures only users with ROLE_ADMIN can reach this

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setConditionStatus(request.getConditionStatus());
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            product.getImages().clear();
            productImageRepository.deleteByProductId(id); // Ensure old images are deleted if replaced
            Product finalProduct = product;
            List<ProductImage> images = imageFiles.parallelStream().map(file -> {
                try {
                    String url = cloudinaryService.uploadImage(file);
                    return ProductImage.builder().product(finalProduct).imageUrl(url).build();
                } catch (java.io.IOException e) {
                    throw new RuntimeException("Image upload failed", e);
                }
            }).collect(Collectors.toList());
            product.getImages().addAll(images);
        }

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        if (!product.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .conditionStatus(product.getConditionStatus())
                .status(product.getStatus())
                .sellerId(product.getSeller().getId())
                .sellerName(product.getSeller().getUsername())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrls(product.getImages() != null
                        ? product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                        : List.of())
                .createdAt(product.getCreatedAt().toString())
                .build();
    }
}
