package com.manjush.expensetracker.expense;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }

        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));

        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDate(updatedExpense.getDate());
        existingExpense.setCategory(updatedExpense.getCategory());

        return expenseRepository.save(existingExpense);
    }
}