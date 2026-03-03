package com.example.demo.controller;

import com.example.demo.dto.ProductRequest;
import com.example.demo.dto.ProductResponse;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "search", required = false) String search) {
        return ResponseEntity.ok(productService.getAllProducts(categoryId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "files", required = false) List<org.springframework.web.multipart.MultipartFile> files) {
        return ResponseEntity.ok(productService.createProduct(request, files));
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable("id") Long id,
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "files", required = false) List<org.springframework.web.multipart.MultipartFile> files) {
        return ResponseEntity.ok(productService.updateProduct(id, request, files));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
