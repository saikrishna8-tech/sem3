package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.entity.Course;
import com.example.demo.entity.Product;
import com.example.demo.service.CategoryService;
import com.example.demo.service.CourseService;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final ProductService productService;
    private final CourseService courseService;
    private final CategoryService categoryService;

    @Autowired
    public SearchController(ProductService productService, CourseService courseService, CategoryService categoryService) {
        this.productService = productService;
        this.courseService = courseService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public Map<String, Object> search(@RequestParam(value = "query", defaultValue = "") String query) {
        Map<String, Object> results = new HashMap<>();

        if (query.trim().isEmpty()) {
            results.put("products", List.of());
            results.put("courses", List.of());
            results.put("categories", List.of());
            return results;
        }

        List<Product> products = productService.searchProducts(query);
        List<Course> courses = courseService.searchCourses(query);
        List<Category> categories = categoryService.searchCategories(query);

        results.put("products", products);
        results.put("courses", courses);
        results.put("categories", categories);

        return results;
    }
}
