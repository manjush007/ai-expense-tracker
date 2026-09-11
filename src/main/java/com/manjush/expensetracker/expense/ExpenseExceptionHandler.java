package com.manjush.expensetracker.expense;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ExpenseExceptionHandler {

    @ExceptionHandler(ExpenseNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleExpenseNotFound(
            ExpenseNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}